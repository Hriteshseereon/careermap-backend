import { UserPortalRepository } from "../repository/userPortal.repository.js";

export const getDashboardData = async (userId) => {
  try {
    const [
      user,
      modules,
      mentors,
      scholarships,
      institutions,
    ] = await Promise.all([
      UserPortalRepository.getUserById(userId),
      UserPortalRepository.getModules(),
      UserPortalRepository.getMentors(),
      UserPortalRepository.getScholarships(),
      UserPortalRepository.getInstitutions(),
    ]);

    return {
      success: true,
      data: {
        user,
        modules,
        mentors,
        scholarships,
        institutions,
      },
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};