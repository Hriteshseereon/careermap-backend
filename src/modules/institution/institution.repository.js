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
  console.log("========== REPOSITORY UPDATE ==========");
  console.log("ID:", id);
  console.log("DATA:", data);

  try {
    const result = await prisma.institutions.update({
      where: { id },
      data,
    });

    console.log("PRISMA UPDATE SUCCESS");
    console.log("RESULT:", result);

    return result;
  } catch (error) {
    console.error("========== PRISMA UPDATE ERROR ==========");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);
    console.error("Full error:", error);

    throw error;
  }
},

  async delete(id) {    
    return prisma.institutions.delete({
      where: { id },
    });
  } 
};

export { InstitutionRepository };