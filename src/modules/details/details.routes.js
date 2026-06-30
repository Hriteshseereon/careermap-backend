import { Router } from "express";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import upload from "../../middlewares/upload.js"
import {
  createDetailsController,
  getAllDetailsController,
  getDetailsByIdController,
  updateDetailsController,
  deleteDetailsController
} from "./details.controller.js";

const router = Router();

router.post("/",upload.single("media"),protectAdmin, createDetailsController);
router.get("/", getAllDetailsController);
router.get("/:id", getDetailsByIdController);
router.put("/:id",upload.single("media"),protectAdmin, updateDetailsController);
router.delete("/:id",protectAdmin, deleteDetailsController);

export default router;