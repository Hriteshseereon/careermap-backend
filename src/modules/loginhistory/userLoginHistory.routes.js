import { Router } from "express";

import {
  createLoginHistoryController,
  getLoginHistoryController,
  getLoginHistoryByIdController,
} from "./userLoginHistory.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();

// USER SAVE LOGIN INFO

router.post(
  "/",
  protectAuth,
  createLoginHistoryController
);

// ADMIN VIEW ALL

router.get(
  "/",
  protectAdmin,
  getLoginHistoryController
);

// ADMIN VIEW SINGLE

router.get(
  "/:id",
  protectAdmin,
  getLoginHistoryByIdController
);

export default router;