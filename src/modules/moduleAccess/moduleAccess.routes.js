import { Router } from "express";

import { protectAuth }
from "../../middlewares/protectAuth.js";

import {
  checkModuleAccessController,
} from "./moduleAccess.controller.js";

const router = Router();

router.post(
  "/check",
  protectAuth,
  checkModuleAccessController
);

export default router;