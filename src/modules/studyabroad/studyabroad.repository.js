import prisma from "../../config/db.js";

export const StudyAbroadRepository = {
  create(data) {
    return prisma.studyAbroad.create({ data });
  },

  findAll() {
    return prisma.studyAbroad.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.studyAbroad.findUnique({
      where: { id },
    });
  },

  update(id, data) {
    return prisma.studyAbroad.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.studyAbroad.delete({
      where: { id },
    });
  },
};