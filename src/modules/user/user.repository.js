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
  }
}

export { UserRepository };