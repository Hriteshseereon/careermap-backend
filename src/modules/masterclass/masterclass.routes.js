import { Router } from "express";
import {
  createMasterClassController,
  getMasterClassesController,
  getMasterClassByIdController,
  updateMasterClassController,
  deleteMasterClassController,
  updateMasterClassFreeStatusController,
} from "./masterclass.controller.js";
import { optionalAuth } from "../../middlewares/optionalAuth.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
const router = Router();

router.post("/", protectAdminOrStaff, createMasterClassController);
// Admin
router.get(
  "/admin",
  protectAdminOrStaff,
  getMasterClassesController
);

// User
router.get(
  "/",
  optionalAuth,
  getMasterClassesController
);
router.get("/:id",optionalAuth,protectAdminOrStaff, getMasterClassByIdController);
router.put("/:id", protectAdminOrStaff, updateMasterClassController);
router.delete("/:id", protectAdminOrStaff, deleteMasterClassController);
router.patch(
  "/:id/free-status",
  protectAdminOrStaff,
  updateMasterClassFreeStatusController
);
export default router;