import prisma from "../../config/db.js";
export async function loadMappings() {
  const [streams, categories, secondCategories, subCategories] =
    await Promise.all([
      prisma.stream.findMany(),
      prisma.category.findMany(),
      prisma.secondcategory.findMany(),
      prisma.subcategory.findMany(),
    ]);

  return {
    streams,
    categories,
    secondCategories,
    subCategories,
  };
}