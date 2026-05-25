import prisma from "../../../config/db.js";

export const UserPortalRepository = {
  getUserById(userId) {
    return prisma.users.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  },

  getModules() {
    return prisma.module.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  },

  getMentors() {
    return prisma.mentor.findMany({
      take: 8,
      where: { status: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getScholarships() {
    return prisma.scholarship.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },

  getInstitutions() {
    return prisma.institutions.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },
};