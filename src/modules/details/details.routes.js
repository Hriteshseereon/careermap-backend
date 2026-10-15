import { Router } from "express";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import upload from "../../middlewares/upload.js"
import {
  createDetailsController,
  getAllDetailsController,
  getDetailsByIdController,
  updateDetailsController,
  deleteDetailsController
} from "./details.controller.js";

const router = Router();

router.post("/",upload.single("media"),protectAdminOrStaff, createDetailsController);
router.get("/", getAllDetailsController);
router.get("/:id", getDetailsByIdController);
router.put("/:id",upload.single("media"),protectAdminOrStaff, updateDetailsController);
router.delete("/:id",protectAdminOrStaff, deleteDetailsController);

export default router;