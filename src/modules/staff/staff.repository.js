import prisma from "../../config/db.js";

export const StaffRepository = {

  create(data) {
    return prisma.staffUser.create({
      data,
    });
  },

  findByEmail(email) {
    return prisma.staffUser.findUnique({
      where: {
        email,
      },

      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  findAll() {
    return prisma.staffUser.findMany({
      include: {
        role: true,
      },
    });
  },

  findById(id) {
    return prisma.staffUser.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  },

  update(id,data) {
    return prisma.staffUser.update({
      where: {
        id:Number(id),
      },
      data,
    });
  },

  delete(id) {
    return prisma.staffUser.delete({
      where: {
        id:Number(id),
      },
    });
  }

};