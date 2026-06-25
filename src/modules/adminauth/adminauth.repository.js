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
  findById(id) {
  return prisma.adminUsers.findUnique({
    where: { id }
  });
},
incrementLoginAttempts(id) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: {
        increment: 1,
      },
    },
  });
},

lockAccount(id) {
  const twentyMinutesLater = new Date(
    Date.now() + 60 * 60 * 1000
  );

  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: 0,
      lockedUntil: twentyMinutesLater,
    },
  });
},

resetLoginAttempts(id) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
    },
  });
},
getActiveSessions(adminId) {
  return prisma.adminSession.count({
    where: {
      adminId,
      isActive: true,
    },
  });
},

createSession(data) {
  return prisma.adminSession.create({
    data,
  });
},

deactivateSession(refreshToken) {
  return prisma.adminSession.updateMany({
    where: {
      refreshToken,
    },
    data: {
      isActive: false,
    },
  });
},
updatePassword(id, hashedPassword) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });
},
findByResetToken(token) {
  return prisma.adminUsers.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });
},
saveResetToken(id, token, expiry) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
},
updatePassword(id, password) {
  return prisma.adminUsers.update({
    where: { id },
    data: {
      password,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
},
};
