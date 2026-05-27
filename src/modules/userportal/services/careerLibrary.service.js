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
export const getNextLevel = async (type, id) => {
  try {

    // 🔹 CATEGORY
    if (type === "category") {

      // 🔥 FIRST CHECK DIRECT DETAILS
      const directDetails =
        await UserPortalRepository.getDetailsByCategory(id);

      if (directDetails.length > 0) {
        return {
          success: true,
          type: "details",
          data: directDetails,
        };
      }

      // 🔥 THEN CHECK SECOND CATEGORY
      const second =
        await UserPortalRepository.getSecondCategories(id);

      if (second.length > 0) {
        return {
          success: true,
          type: "secondcategory",
          data: second,
        };
      }

      return { success: true, type: "details", data: [] };
    }

    // 🔹 SECOND CATEGORY
    if (type === "second") {

      // 🔥 FIRST CHECK MID-LEVEL DETAILS
      const details =
        await UserPortalRepository.getDetailsBySecond(id);

      if (details.length > 0) {
        return {
          success: true,
          type: "details",
          data: details,
        };
      }

      // 🔥 THEN CHECK SUBCATEGORY
      const sub =
        await UserPortalRepository.getSubCategories(id);

      if (sub.length > 0) {
        return {
          success: true,
          type: "subcategory",
          data: sub,
        };
      }

      return { success: true, type: "details", data: [] };
    }

    // 🔹 SUB CATEGORY
    if (type === "sub") {
      const details =
        await UserPortalRepository.getDetailsBySubCategory(id);

      return {
        success: true,
        type: "details",
        data: details,
      };
    }

    return { success: false, message: "Invalid type" };

  } catch (error) {
    return { success: false, message: error.message };
  }
};