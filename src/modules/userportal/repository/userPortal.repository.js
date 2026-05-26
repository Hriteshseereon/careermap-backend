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
// 🔹 Get all categories
getAllCategories() {
  return prisma.category.findMany({
   
    orderBy: { createdAt: "desc" },
  });
},

// 🔹 Get second categories by categoryId
getSecondCategories(categoryId) {
  return prisma.secondcategory.findMany({
    where: { categoryId: Number(categoryId) },
    orderBy: { createdAt: "desc" },
  });
},

// 🔹 Get subcategories by secondcategoryId
getSubCategories(secondcategoryId) {
  return prisma.subcategory.findMany({
    where: { secondcategoryId: Number(secondcategoryId) },
    orderBy: { createdAt: "desc" },
  });
},

// 🔹 Get details by subcategoryId
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
    },
  });
}

};