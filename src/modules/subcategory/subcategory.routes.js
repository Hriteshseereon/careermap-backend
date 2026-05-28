import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

import {
  createSubCategoryController,
  getSubCategoriesController,
  getSubCategoryByIdController,
  updateSubCategoryController,
  deleteSubCategoryController,
    getSubBySecondCategoryController,
} from "./subcategory.controller.js";

const router = Router();

// CREATE
router.post(
  "/",
  protectAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createSubCategoryController
);

// GET ALL
router.get("/", getSubCategoriesController);

// GET BY ID
router.get("/:id", getSubCategoryByIdController);

// UPDATE
router.put(
  "/:id",
  protectAdmin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateSubCategoryController
);

// DELETE
router.delete("/:id", protectAdmin, deleteSubCategoryController);
router.get(
  "/second/:secondcategoryId",
  getSubBySecondCategoryController
);
export default router;