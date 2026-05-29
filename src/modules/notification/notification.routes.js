import { Router } from "express";

import {

  createNotificationController,
  getNotificationsController,
  getNotificationByIdController,
  updateNotificationController,
  getUserNotificationsController,

} from "./notification.controller.js";

import { protectAdmin }
from "../../middlewares/protectAdmin.js";

const router = Router();

// 🔥 ADMIN CRUD

router.post(
  "/",
  protectAdmin,
  createNotificationController
);

router.get(
  "/",
  protectAdmin,
  getNotificationsController
);

router.get(
  "/:id",
  protectAdmin,
  getNotificationByIdController
);

router.put(
  "/:id",
  protectAdmin,
  updateNotificationController
);

// 🔥 USER NOTIFICATION API
router.get(
  "/user/all",
  getUserNotificationsController
);

export default router;