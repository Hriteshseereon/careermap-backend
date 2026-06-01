import { Router } from "express";

import {

  createHelpRequestController,
  getHelpRequestsController,
  getHelpRequestByIdController,
  updateHelpStatusController,

} from "./helpandsupport.controller.js";

import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();

// USER
router.post(
  "/",
  protectAuth,
  createHelpRequestController
);

// ADMIN
router.get(
  "/",
  protectAdmin,
  getHelpRequestsController
);

router.get(
  "/:id",
  protectAdmin,
  getHelpRequestByIdController
);

router.put(
  "/:id/status",
  protectAdmin,
  updateHelpStatusController
);

export default router;