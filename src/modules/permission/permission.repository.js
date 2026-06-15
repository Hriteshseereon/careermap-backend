import prisma from "../../config/db.js";

export const PermissionRepository = {

  create(data) {
    return prisma.permission.create({
      data,
      include: {
        role: true,
      },
    });
  },

  findAll() {
    return prisma.permission.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id) {
    return prisma.permission.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        role: true,
      },
    });
  },

  findByRoleAndModule(roleId, module) {
    return prisma.permission.findFirst({
      where: {
        roleId: Number(roleId),
        module,
      },
    });
  },

  update(id, data) {
    return prisma.permission.update({
      where: {
        id: Number(id),
      },
      data,
      include: {
        role: true,
      },
    });
  },

  delete(id) {
    return prisma.permission.delete({
      where: {
        id: Number(id),
      },
    });
  },
};