import prisma from "../../config/db.js";

export const detailsRepository = {

  create: (data) => {
  return prisma.details.create({
    data: {
  jobScope: data.jobScope,

  stream: {
    connect: { id: data.streamId }
  },

  ...(data.categoryId && {
    category: {
      connect: { id: data.categoryId }
    }
  }),

  ...(data.secondcategoryId && {
    secondcategory: {
      connect: { id: data.secondcategoryId }
    }
  }),

  ...(data.subcategoryId && {
    subcategory: {
      connect: { id: data.subcategoryId }
    }
  }),

  salaryRanges: data.salaryRanges,

  ...(data.careerpathId && {
    careerpath: { connect: { id: data.careerpathId } }
  }),
  ...(data.entranceexamId && {
    entranceexam: { connect: { id: data.entranceexamId } }
  }),
  ...(data.institutionId && {
    institution: { connect: { id: data.institutionId } }
  })
},
    include: {
      salaryRanges: true,
      stream: true,
      category: true,
      secondcategory: true,
      subcategory: true
    }
  });
},

  findAll: () => {
    return prisma.details.findMany({
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true
      }
    });
  },

  findById: (id) => {
    return prisma.details.findUnique({
      where: { id },
      include: {
        salaryRanges: true,
        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true
      }
    });
  },

 update: (id, data) => {
  return prisma.details.update({
    where: { id },
    data: {
      jobScope: data.jobScope,

      ...(data.streamId && {
        stream: { connect: { id: data.streamId } }
      }),

      ...(data.categoryId && {
        category: { connect: { id: data.categoryId } }
      }),

      ...(data.secondcategoryId && {
        secondcategory: { connect: { id: data.secondcategoryId } }
      }),

      ...(data.subcategoryId && {
        subcategory: { connect: { id: data.subcategoryId } }
      }),

      ...(data.salaryRanges && {
        salaryRanges: {
          deleteMany: {},
          create: data.salaryRanges
        }
      }),

      ...(data.careerpathId && {
        careerpath: { connect: { id: data.careerpathId } }
      }),
      ...(data.entranceexamId && {
        entranceexam: { connect: { id: data.entranceexamId } }
      }),
      ...(data.institutionId && {
        institution: { connect: { id: data.institutionId } }
      })
    },
    include: {
      salaryRanges: true
    }
  });
},

  delete: (id) => {
    return prisma.details.delete({
      where: { id }
    });
  }
};