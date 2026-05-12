import prisma from "../../config/db.js";

export const CategoryRepository = {
  create(data) {
    return prisma.category.create({
      data,
    });
  },

  findAll() {
    return prisma.category.findMany({
      include: {
        stream: true,
        institution: true,
        secondCategories: true,
        subcategories: true,
      },
    });
  },

  findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        stream: true,
        institution: true,
        secondCategories: true,
        subcategories: true,
      },
    });
  },

  update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  },
};