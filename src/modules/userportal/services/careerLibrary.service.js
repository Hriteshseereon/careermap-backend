import { UserPortalRepository } from "../repository/userPortal.repository.js";

export const getCategories = async () => {
  try {
    const data = await UserPortalRepository.getAllCategories();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSecondCategories = async (categoryId) => {
  try {
    const data =
      await UserPortalRepository.getSecondCategories(categoryId);

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSubCategories = async (secondcategoryId) => {
  try {
    const data =
      await UserPortalRepository.getSubCategories(secondcategoryId);

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getDetails = async (subcategoryId) => {
  try {
    const data =
      await UserPortalRepository.getDetailsBySubCategory(subcategoryId);

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};