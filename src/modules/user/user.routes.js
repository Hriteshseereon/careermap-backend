import { Router } from "express";
import {signup, updateProfileController} from "./user.controller.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectTemp } from "../../middlewares/protectTemp.js";
const router = Router();

router.post('/signup', protectTemp, signup);
router.put(
  "/profile",
  protectAuth,
  updateProfileController
);
export default router;
    