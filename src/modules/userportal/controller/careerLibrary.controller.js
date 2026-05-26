import {
  getCategories,
  getSecondCategories,
  getSubCategories,
  getDetails,
} from "../services/careerLibrary.service.js";

// 🔹 Categories
export const getCategoriesController = async (req, res) => {
  const result = await getCategories();
  res.status(result.success ? 200 : 400).json(result);
};

// 🔹 Second Categories
export const getSecondCategoriesController = async (req, res) => {
  const result = await getSecondCategories(req.params.categoryId);
  res.status(result.success ? 200 : 400).json(result);
};

// 🔹 Sub Categories
export const getSubCategoriesController = async (req, res) => {
  const result = await getSubCategories(req.params.secondcategoryId);
  res.status(result.success ? 200 : 400).json(result);
};

// 🔹 Details
export const getDetailsController = async (req, res) => {
  const result = await getDetails(req.params.subcategoryId);
  res.status(result.success ? 200 : 400).json(result);
};