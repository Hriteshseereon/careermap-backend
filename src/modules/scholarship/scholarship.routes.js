import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { optionalAuth } from "../../middlewares/optionalAuth.js";

import {
  createScholarshipController,
  getScholarshipsController,
  getScholarshipByIdController,
  updateScholarshipController,
  deleteScholarshipController,
} from "./scholarship.controller.js";

const router = Router();

router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createScholarshipController
);

router.get("/", getScholarshipsController);
router.get("/:id", optionalAuth, getScholarshipByIdController);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateScholarshipController
);

router.delete("/:id", protectAdmin, deleteScholarshipController);

export default router;