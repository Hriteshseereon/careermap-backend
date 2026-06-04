import { Router } from "express";
import {signup, updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController, getAllUsersController,getUserByIdController, banUserController,
  unbanUserController,getBannedUsersController} from "./user.controller.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import {protectAdmin} from "../../middlewares/protectAdmin.js";
import { protectTemp } from "../../middlewares/protectTemp.js";
const router = Router();

router.post('/signup', protectTemp, signup);
router.put(
  "/profile",
  protectAuth,
  updateProfileController
);
router.put(
  "/change-password",
  protectAuth,
  changePasswordController
);

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);
router.get(
  "/admin/users",
  protectAdmin,
  getAllUsersController
);
router.get(
  "/admin/users/:id",
  protectAdmin,
  getUserByIdController
);

router.put(
  "/admin/users/:id/ban",
  protectAdmin,
  banUserController
);

router.put(
  "/admin/users/:id/unban",
  protectAdmin,
  unbanUserController
);
router.get(
  "/admin/banned-users",
  protectAdmin,
  getBannedUsersController
);
export default router;
    