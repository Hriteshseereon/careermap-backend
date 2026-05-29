import { Router } from "express";
import { signupAdmin, loginAdmin,refreshTokenAdmin, } from "./adminauth.controller.js";

const router = Router();

// 🔹 Admin Auth Routes
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshTokenAdmin);
export default router;