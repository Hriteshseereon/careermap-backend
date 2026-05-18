import prisma from "../../config/db.js";

export const entranceExamRepository = {
  create: (data)=> prisma.entranceExam.create({ data }),

  findAll: ()=> prisma.entranceExam.findMany({
    include:{ stream:true, category:true }
  }),

  findById: (id)=> prisma.entranceExam.findUnique({
    where:{id}
  }),

  update: (id,data)=> prisma.entranceExam.update({
    where:{id},
    data
  }),

  delete: (id)=> prisma.entranceExam.delete({
    where:{id}
  })
};