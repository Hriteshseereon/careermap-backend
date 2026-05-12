import prisma from '../../config/db.js';



export const AdminAuthRepository = {
  findByEmail(email) {
    return prisma.adminUsers.findUnique({
      where: { email },
    });

  },

  createAdmin(data) {
    return prisma.adminUsers.create({
      data,
    });
  },
};
