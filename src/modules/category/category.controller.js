import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.services.js";

// CREATE
export const createCategoryController = async (req, res) => {
  try {
    const coverImage = req.files?.coverImage?.[0];
    const file = req.files?.file?.[0];

    const result = await createCategory(req.body, {
      coverImage,
      file,
    });

    res.status(result.success ? 201 : 400).json(result);

  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
export const getCategoriesController = async (req, res) => {
  const result = await getCategories();
  res.status(200).json(result);
};

// GET BY ID
export const getCategoryByIdController = async (req, res) => {
  const result = await getCategoryById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateCategoryController = async (req, res) => {
  const coverImage = req.files?.coverImage?.[0];
  const file = req.files?.file?.[0];

  const result = await updateCategory(req.params.id, req.body, {
    coverImage,
    file,
  });

  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteCategoryController = async (req, res) => {
  const result = await deleteCategory(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};