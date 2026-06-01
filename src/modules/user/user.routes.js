import { Router } from "express";
import {signup, updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController} from "./user.controller.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
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
export default router;
    