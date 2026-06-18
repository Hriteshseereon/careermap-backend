import { Router } from "express";

import {
  getAdminNotificationsController,
} from "./adminnotification.controller.js";

const router = Router();

router.get(
  "/",
  getAdminNotificationsController
);

export default router;