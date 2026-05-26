import { Router } from "express";
import {
  getCategoriesController,
  getSecondCategoriesController,
  getSubCategoriesController,
  getDetailsController,
} from "../controller/careerLibrary.controller.js";

const router = Router();

// 🔥 Career Library APIs

router.get("/categories", getCategoriesController);

router.get(
  "/categories/:categoryId/second",
  getSecondCategoriesController
);

router.get(
  "/second/:secondcategoryId/sub",
  getSubCategoriesController
);

router.get(
  "/subcategory/:subcategoryId/details",
  getDetailsController
);

export default router;