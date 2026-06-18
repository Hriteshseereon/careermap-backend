import prisma from "../../config/db.js";

export const ScholarshipRepository = {
  create(data) {
    return prisma.scholarship.create({ data });
  },

  findAll() {
  return prisma.scholarship.findMany({
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},

  findById(id) {
  return prisma.scholarship.findUnique({
    where: { id },
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},

  findByName(name) {   // ✅ for unique check
    return prisma.scholarship.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // case-insensitive
        },
      },
    });
  },

  update(id, data) {
    return prisma.scholarship.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.scholarship.delete({
      where: { id },
    });
  },
};