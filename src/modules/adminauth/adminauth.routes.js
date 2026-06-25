import { Router } from "express";
import { signupAdmin, loginAdmin,refreshTokenAdmin,adminLogout,changePasswordAdmin,forgotPasswordAdmin,
  resetPasswordAdmin,
} from "./adminauth.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";
const router = Router();

// 🔹 Admin Auth Routes
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshTokenAdmin);
router.post("/logout", adminLogout);
router.post(
  "/change-password",
  protectAdmin, 
  changePasswordAdmin
);

router.post(
  "/forgot-password",
  forgotPasswordAdmin
);

router.post(
  "/reset-password",
  resetPasswordAdmin
);
export default router;