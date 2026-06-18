import { Router } from "express";
import {
  createMasterClassController,
  getMasterClassesController,
  getMasterClassByIdController,
  updateMasterClassController,
  deleteMasterClassController,
} from "./masterclass.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
const router = Router();

router.post("/", protectAdminOrStaff, createMasterClassController);
router.get("/", getMasterClassesController);
router.get("/:id", getMasterClassByIdController);
router.put("/:id", protectAdminOrStaff, updateMasterClassController);
router.delete("/:id", protectAdminOrStaff, deleteMasterClassController);

export default router;