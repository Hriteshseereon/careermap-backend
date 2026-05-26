import prisma from "../../../config/db.js";

export const UserPortalRepository = {
  getUserById(userId) {
    return prisma.users.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  },

  getModules() {
    return prisma.module.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  },

  getMentors() {
    return prisma.mentor.findMany({
      take: 8,
      where: { status: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getScholarships() {
    return prisma.scholarship.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },

  getInstitutions() {
    return prisma.institutions.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  },
  getAvailability(mentorId) {
  return prisma.mentorAvailability.findMany({
    where: {
      mentorId: Number(mentorId),
      date: {
        gte: new Date(), // 🔥 only future
      },
    },
    orderBy: {
      date: "asc",
    },
  });
},

getBookings(mentorId) {
  return prisma.mentorbooking.findMany({
    where: {
      mentorId: Number(mentorId),
      status: "confirmed", // or paymentStatus: "paid"
    },

  });
},
  // 🔹 CATEGORY
  getAllCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔹 SECOND CATEGORY
  getSecondCategories(categoryId) {
    return prisma.secondcategory.findMany({
      where: { categoryId: Number(categoryId) },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔹 SUB CATEGORY
  getSubCategories(secondcategoryId) {
    return prisma.subcategory.findMany({
      where: { secondcategoryId: Number(secondcategoryId) },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔥 DETAILS BY SUBCATEGORY (DEEP LEVEL)
  getDetailsBySubCategory(subcategoryId) {
    return prisma.details.findMany({
      where: { subcategoryId: Number(subcategoryId) },

      include: {
        salaryRanges: true,

        stream: true,
        category: true,
        secondcategory: true,
        subcategory: true,
        institution: true,

        careerpath: {
          include: {
            module: true,
            path: true,
          },
        },

        entranceexam: true,
      },
    });
  },

  // 🔥 DETAILS BY CATEGORY (DIRECT LEVEL)
  getDetailsByCategory(categoryId) {
    return prisma.details.findMany({
      where: {
        categoryId: Number(categoryId),
        subcategoryId: null,        // 🔥 IMPORTANT (direct only)
        secondcategoryId: null,     // 🔥 IMPORTANT
      },

      include: {
        salaryRanges: true,

        stream: true,
        category: true,
        institution: true,

        careerpath: {
          include: {
            module: true,
            path: true,
          },
        },

        entranceexam: true,
      },
    });
  },

  // 🔥 DETAILS BY SECOND CATEGORY (MID LEVEL)
  getDetailsBySecond(secondcategoryId) {
    return prisma.details.findMany({
      where: {
        secondcategoryId: Number(secondcategoryId),
        subcategoryId: null, // 🔥 only mid-level
      },

      include: {
        salaryRanges: true,

        stream: true,
        category: true,
        secondcategory: true,

        careerpath: {
          include: {
            module: true,
            path: true,
          },
        },

        entranceexam: true,
      },
    });
  },
};