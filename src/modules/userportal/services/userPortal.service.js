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

      // 🔥 get ALL modules (not filtered)
      prisma.module.findMany(),

      UserPortalRepository.getMentors(),
      UserPortalRepository.getScholarships(),
      UserPortalRepository.getInstitutions(),
    ]);

    // 🔥 get active subscription
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        userId,
        status: "active",
        endDate: { gte: new Date() },
      },
      include: {
        plan: {
          include: {
            modules: true,
          },
        },
      },
    });

    // 🔥 get unlocked module IDs
    const unlockedModuleIds =
      subscription?.plan?.modules.map((m) => m.id) || [];

    // 🔥 attach unlock logic
    const modules = allModules.map((mod) => ({
  ...mod,
  isUnlocked:
    mod.markas_free || unlockedModuleIds.includes(mod.id),
}));

    return {
      success: true,
      data: {
        user,
        modules,
        mentors,
        scholarships,
        institutions,
        subscription, // 🔥 include subscription details in response
      },
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
};