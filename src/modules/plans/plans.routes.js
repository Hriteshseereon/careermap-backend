import { Router } from "express";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
} from "./plans.controller.js";

const router = Router();

router.post("/", protectAdmin, createPlanController);
router.get("/", getPlansController);
router.get("/:id", getPlanByIdController);
router.put("/:id", protectAdmin, updatePlanController);
router.delete("/:id", protectAdmin, deletePlanController);

export default router;