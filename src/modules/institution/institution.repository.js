import prisma from "../../config/db.js";
const InstitutionRepository = {
  async createInstitution(data) {
    return prisma.institutions.create({ data });
  },

  async findAll() {
    return prisma.institutions.findMany();
  },
async findById(id) {
    return prisma.institutions.findUnique({ where: { id } });
  },
  async update(id, data) {
    return prisma.institutions.update({
      where: { id },
      data,
    });
  },

  async delete(id) {    
    return prisma.institutions.delete({
      where: { id },
    });
  } 
};

export { InstitutionRepository };