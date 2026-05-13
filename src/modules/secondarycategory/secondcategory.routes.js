import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import {
  createSecondCategoryController,
  getSecondCategoriesController,
  getSecondCategoryByIdController,
  updateSecondCategoryController,
  deleteSecondCategoryController,
} from "./secondcategory.controller.js";

const router = Router();

router.post(
  "/",
  protectAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createSecondCategoryController
);

router.get("/", getSecondCategoriesController);
router.get("/:id", getSecondCategoryByIdController);

router.put(
  "/:id",
  protectAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateSecondCategoryController
);

router.delete("/:id", protectAdmin, deleteSecondCategoryController);

export default router;