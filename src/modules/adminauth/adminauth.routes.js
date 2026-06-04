import { Router } from "express";
import { signupAdmin, loginAdmin,refreshTokenAdmin,adminLogout
} from "./adminauth.controller.js";

const router = Router();

// 🔹 Admin Auth Routes
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshTokenAdmin);
router.post("/logout", adminLogout);
export default router;