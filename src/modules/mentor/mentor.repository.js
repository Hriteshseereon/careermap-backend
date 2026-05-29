import prisma from "../../config/db.js";

export const MentorRepository = {
  create(data) {
    return prisma.mentor.create({ data });
  },

  findAll() {
    return prisma.mentor.findMany({
      include: {
        category: true,
        subcategory: true,
        availability:true,
      },
    });
  },

  findById(id) {
    return prisma.mentor.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        availability:true,
      },
    });
  },

  update(id, data) {
    return prisma.mentor.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.mentor.delete({
      where: { id },
    });
  },
  
findByName(name) {
  return prisma.mentor.findFirst({
    where: {
      name: name,
    },
  });
}
};