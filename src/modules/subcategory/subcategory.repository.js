import prisma from "../../config/db.js";

export const SubCategoryRepository = {
  create(data) {
    return prisma.subcategory.create({ data });
  },

  findAll() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
        secondcategory: true,
        institution: true,
      },
    });
  },

  findById(id) {
    return prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true,
        secondcategory: true,
        institution: true,
      },
    });
  },

  update(id, data) {
    return prisma.subcategory.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.subcategory.delete({
      where: { id },
    });
  },
};