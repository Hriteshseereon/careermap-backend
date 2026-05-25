import { Router } from "express";
import {
  createStudyAbroadController,
  getStudyAbroadController,
  getStudyAbroadByIdController,
  updateStudyAbroadController,
  deleteStudyAbroadController,
} from "./studyabroad.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();

router.post("/", protectAdmin, createStudyAbroadController);
router.get("/", getStudyAbroadController);
router.get("/:id", getStudyAbroadByIdController);
router.put("/:id", protectAdmin, updateStudyAbroadController);
router.delete("/:id", protectAdmin, deleteStudyAbroadController);

export default router;