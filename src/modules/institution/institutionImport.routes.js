import { Router } from "express";

import upload from "../../middlewares/upload.js";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";

import {
  uploadInstitutionExcelController,
} from "./institutionImport.controller.js";

const router = Router();

router.post(
  "/",
  protectAdmin,
  upload.single("file"),
  uploadInstitutionExcelController
);

export default router;