import express from "express";
import {
  createCounselingController,
  getCounselingsController,
  getCounselingByIdController,
  updateCounselingController,
  deleteCounselingController,
} from "./counseling.controller.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = express.Router();

router.post("/",protectAdminOrStaff, createCounselingController);
router.get("/",protectAdminOrStaff, getCounselingsController);
router.get("/:id",protectAdminOrStaff, getCounselingByIdController);
router.put("/:id",protectAdminOrStaff, updateCounselingController);
router.delete("/:id",protectAdminOrStaff, deleteCounselingController);

export default router;