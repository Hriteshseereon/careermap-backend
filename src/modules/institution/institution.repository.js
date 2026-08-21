import prisma from "../../config/db.js";
const InstitutionRepository = {
  async createInstitution(data) {
    return prisma.institutions.create({ data });
  },

  async findAll() {
  return prisma.institutions.findMany({
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},
async findById(id) {
  return prisma.institutions.findUnique({
    where: { id },
    include: {
      category: true,
      secondcategory: true,
      subcategory: true,
    },
  });
},
async update(id, data) {
  try {
    return await prisma.institutions.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Prisma Institution Update Error:", error);
    throw error;
  }
},
  async delete(id) {    
    return prisma.institutions.delete({
      where: { id },
    });
  },
  async findPaginated(page = 1, limit = 30) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.institutions.findMany({
      skip,
      take: limit,
      include: {
        category: true,
        secondcategory: true,
        subcategory: true,
      },
      orderBy: {
        id: "asc",
      },
    }),

    prisma.institutions.count(),
  ]);

  return {
    data,
    total,
  };
},
};

export { InstitutionRepository };