import { Router } from "express";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import {
  createDetailsController,
  getAllDetailsController,
  getDetailsByIdController,
  updateDetailsController,
  deleteDetailsController
} from "./details.controller.js";

const router = Router();

router.post("/",protectAdmin, createDetailsController);
router.get("/", getAllDetailsController);
router.get("/:id", getDetailsByIdController);
router.put("/:id",protectAdmin, updateDetailsController);
router.delete("/:id",protectAdmin, deleteDetailsController);

export default router;