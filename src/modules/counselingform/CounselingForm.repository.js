import prisma from "../../config/db.js";

export const CounselingRepository = {
    create(data){
          return prisma.counselingForm.create({
      data,
    });
    },
    findAll(where = {}){
      return prisma.counselingForm.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    findById(id) {
  return prisma.counselingForm.findUnique({
    where: { id },
  });
},
    update(id,data){
        return prisma.counselingForm.update({
            where:{id},
            data,
        })
    },
    delete(id){
        return prisma.counselingForm.delete({
            where:{id},
        })
    }
}