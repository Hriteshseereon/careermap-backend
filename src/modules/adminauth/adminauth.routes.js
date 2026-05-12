import { Router } from "express";
import { signupAdmin, loginAdmin } from "./adminauth.controller.js";

const router = Router();

// 🔹 Admin Auth Routes
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

export default router;