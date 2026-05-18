import prisma from "../../config/db.js";

export const detailsRepository = {

  create: (data) => {
    return prisma.details.create({
      data,
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true
      }
    });
  },

  findAll: () => {
    return prisma.details.findMany({
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true
      }
    });
  },

  findById: (id) => {
    return prisma.details.findUnique({
      where: { id },
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true
      }
    });
  },

  update: (id, data) => {
    return prisma.details.update({
      where: { id },
      data,
      include: {
        salaryRanges: true
      }
    });
  },

  delete: (id) => {
    return prisma.details.delete({
      where: { id }
    });
  }
};