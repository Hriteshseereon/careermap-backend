import { Router } from "express";
import {signup, updateProfileController,changePasswordController} from "./user.controller.js";
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
export default router;
    