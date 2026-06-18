import { Router } from "express";

import {
  getDashboardController,
} from "./adminDashboard.controller.js";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
const router = Router();

router.get(
  "/dashboard",
  protectAdminOrStaff,
  getDashboardController
);

export default router;