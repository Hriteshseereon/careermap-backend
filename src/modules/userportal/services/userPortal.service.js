import prisma from "../../../config/db.js";
import {
  canAccessAssessment,
  isAssessmentModule,
} from "../../../constants/assessmentAccess.js";
import { UserPortalRepository } from "../repository/userPortal.repository.js";

// export const getDashboardData = async (userId) => {
//   try {
//     const [
//       user,
//       modules,
//       mentors,
//       scholarships,
//       institutions,
//     ] = await Promise.all([
//       UserPortalRepository.getUserById(userId),
//       UserPortalRepository.getModules(),
//       UserPortalRepository.getMentors(),
//       UserPortalRepository.getScholarships(),
//       UserPortalRepository.getInstitutions(),
//     ]);

//     return {
//       success: true,
//       data: {
//         user,
//         modules,
//         mentors,
//         scholarships,
//         institutions,
//       },
//     };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };
export const getDashboardData = async (userId) => {
  try {

    const [
      user,
      allModules,
      mentors,
      scholarships,
      institutions,
      plans,
      entranceExams,
    ] = await Promise.all([
      UserPortalRepository.getUserById(userId),

      prisma.module.findMany(),

      UserPortalRepository.getMentors(),
      UserPortalRepository.getScholarships(),
      UserPortalRepository.getInstitutions(),
      UserPortalRepository.getPlans(),
      UserPortalRepository.getEntranceExams(),
    ]);

    // Active Subscription
    // const subscription =
    //   await prisma.subscriptions.findFirst({
    //     where: {
    //       userId: Number(userId),
    //       status: "active",
    //       endDate: {
    //         gte: new Date(),
    //       },
    //     },

    //     include: {
    //       plan: {
    //         include: {
    //           modules: true,
    //         },
    //       },
    //     },
    //   });
const subscriptions =
  await prisma.subscriptions.findMany({
    where: {
      userId: Number(userId),
      status: "active",
      endDate: {
        gte: new Date(),
      },
    },
    include: {
      plan: {
        include: {
          modules: true,
        },
      },
    },
  });
    // Subscription se unlocked modules
    // const unlockedModuleIds =
    //   subscription?.plan?.modules?.map(
    //     (m) => m.id
    //   ) || [];
const unlockedModuleIds = [
  ...new Set(
    subscriptions.flatMap((subscription) =>
      subscription.plan.modules.map(
        (module) => module.id
      )
    )
  ),
];
    const instituteHasAssessmentAccess = canAccessAssessment(user);

    // Final module status — repeatable 15s preview until purchase
    const modules = allModules.map((mod) => {
      if (isAssessmentModule(mod)) {
        return {
          ...mod,
          accessStatus: instituteHasAssessmentAccess ? "unlocked" : "locked",
          previewDurationSeconds: null,
        };
      }

      return {
        ...mod,
        accessStatus:
          mod.markas_free || unlockedModuleIds.includes(mod.id)
            ? "unlocked"
            : mod.freePreview
            ? "preview"
            : "locked",
        previewDurationSeconds: mod.freePreview ? 15 : null,
      };
    });
 const pendingMentorReviews =
  await prisma.mentorbooking.findMany({
    where: {
      userId: Number(userId),

      status: "confirmed",

      reviewSubmitted: false,

      date: {
        lt: new Date(),
      },
    },

    include: {
      mentor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const reviews =
  pendingMentorReviews.map(
    (item) => ({
      bookingId: item.id,

      mentorId:
        item.mentor.id,

      mentorName:
        item.mentor.name,

      date:
        item.date,

      timeSlot:
        item.timeSlot,

      canReview: true,
    })
  );
    return {
      success: true,
      data: {
        user,
        modules,
        mentors,
        plans,
        scholarships,
        institutions,
         entranceExams,
        subscriptions,
          pendingMentorReviews:
      reviews,
      },
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message: error.message,
    };
  }
};