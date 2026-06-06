import prisma from "../../../config/db.js";

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
    ] = await Promise.all([
      UserPortalRepository.getUserById(userId),

      prisma.module.findMany(),

      UserPortalRepository.getMentors(),
      UserPortalRepository.getScholarships(),
      UserPortalRepository.getInstitutions(),
    ]);

    // Active Subscription
    const subscription =
      await prisma.subscriptions.findFirst({
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
    const unlockedModuleIds =
      subscription?.plan?.modules?.map(
        (m) => m.id
      ) || [];

    // Preview usage
    const accesses =
      await UserPortalRepository.getModuleAccess(
        userId
      );

    const usedPreviewIds =
      accesses.map(
        (item) => item.moduleId
      );

    // Final module status
    const modules = allModules.map(
      (mod) => ({
        ...mod,

        accessStatus:
          mod.markas_free ||
          unlockedModuleIds.includes(
            mod.id
          )
            ? "unlocked"
            : mod.freePreview &&
              !usedPreviewIds.includes(
                mod.id
              )
            ? "preview"
            : "locked",
      })
    );

    return {
      success: true,
      data: {
        user,
        modules,
        mentors,
        scholarships,
        institutions,
        subscription,
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