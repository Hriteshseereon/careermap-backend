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
async findPaginated(
  page = 1,
  limit = 30,
  country = "",
  state = "",
  type = "",
  categoryId = ""
) {
  const skip = (page - 1) * limit;

  const where = {};

  if (country) {
    where.countruy = {
      equals: country,
      mode: "insensitive",
    };
  }

  if (state) {
    where.state = {
      equals: state,
      mode: "insensitive",
    };
  }

  if (type) {
    where.institute_type = {
      equals: type,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  const [data, total] = await Promise.all([
    prisma.institutions.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        secondcategory: true,
        subcategory: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.institutions.count({
      where,
    }),
  ]);

  return {
    data,
    total,
  };
}
};

export { InstitutionRepository }; 