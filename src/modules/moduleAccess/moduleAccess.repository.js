import prisma from "../../config/db.js";

export const ModuleAccessRepository = {

  findAccess(userId, moduleId) {
    return prisma.moduleAccess.findUnique({
      where: {
        userId_moduleId: {
          userId: Number(userId),
          moduleId: Number(moduleId),
        },
      },
    });
  },

  createAccess(userId, moduleId) {
    return prisma.moduleAccess.create({
      data: {
        userId: Number(userId),
        moduleId: Number(moduleId),
        freeVisitUsed: true,
      },
    });
  },

};