import prisma from '../../config/db.js';

const UserRepository = {
  async findByEmail(email) {
    return prisma.users.findUnique({ where: { email } });
  },
   async findById(id) {
    return prisma.users.findUnique({ where: { id } });
  },
async findByMobile(mobile) {
  return prisma.users.findFirst({
    where: { mobile }
  });
},
async updateUser(id, data) {
  return prisma.users.update({
    where: { id },
    data,
  });
},
async updatePassword(id, password) {
  return prisma.users.update({
    where: { id },
    data: {
      password,
    },
  });
},
  async createUserWithLandingData(userData, landingData) {
    return prisma.users.create({
      data: {
        ...userData,

        profile: {
          create: {
            class: landingData.class,
            stream: landingData.stream,
            interest: landingData.interest,
            clarity: landingData.clarity,
            strength: landingData.strength,
            priority: landingData.priority
          }
        }
      },
      include: {
         profile: true
      }
    });
  },

  // get all user list with pagination
  getAllUsers() {
  return prisma.users.findMany({
    include: {
      profile: true,
      subscription: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
},
getUserById(id) {
  return prisma.users.findUnique({
    where: {
      id,
    },

    include: {
      profile: true,
      subscription: true,
      payments: true,
      userloginhistory: true,
    },
  });
},

banUser(id) {
  return prisma.users.update({
    where: { id },
    data: {
      status: "banned",
    },
  });
},
unbanUser(id) {
  return prisma.users.update({
    where: { id },
    data: {
      status: "active",
    },
  });
},

getBannedUsers() {
  return prisma.users.findMany({
    where: {
      status: "banned",
    },
     include: {
      profile: true,
    },
  });
},
getUserTransactions(userId) {
  return prisma.payment.findMany({
    where: {
      userId,
    },

    include: {
      plan: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
},
async getLoginHistory(userId) {
  return prisma.userLoginHistory.findMany({
    where: {
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },

    orderBy: {
      loginAt: "desc",
    },
  });
}
}

export { UserRepository };