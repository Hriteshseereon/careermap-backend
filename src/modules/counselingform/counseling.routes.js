import express from "express";
import {
  createCounselingController,
  getCounselingsController,
  getCounselingByIdController,
  updateCounselingController,
  deleteCounselingController,
} from "./counseling.controller.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = express.Router();

router.post("/",protectAdmin, createCounselingController);
router.get("/",protectAdmin, getCounselingsController);
router.get("/:id",protectAdmin, getCounselingByIdController);
router.put("/:id",protectAdmin, updateCounselingController);
router.delete("/:id",protectAdmin, deleteCounselingController);

export default router;