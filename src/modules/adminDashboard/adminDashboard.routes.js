import { Router } from "express";

import {
  getDashboardController,
} from "./adminDashboard.controller.js";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";

const router = Router();

router.get(
  "/dashboard",
  protectAdmin,
  getDashboardController
);

export default router;