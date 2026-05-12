import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";

const router = Router();

// 🔹 Routes
router.post("/", protectAdmin, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), createCategoryController);
router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id", protectAdmin, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), updateCategoryController);
router.delete("/:id", protectAdmin, deleteCategoryController);

export default router;