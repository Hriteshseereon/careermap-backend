import { Router } from "express";
import {
  createMasterClassController,
  getMasterClassesController,
  getMasterClassByIdController,
  updateMasterClassController,
  deleteMasterClassController,
} from "./masterclass.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();

router.post("/", protectAdmin, createMasterClassController);
router.get("/", getMasterClassesController);
router.get("/:id", getMasterClassByIdController);
router.put("/:id", protectAdmin, updateMasterClassController);
router.delete("/:id", protectAdmin, deleteMasterClassController);

export default router;