import { Router } from "express";
import {sendOTP, verifyOTP,loginWithPassword} from "./auth.controller.js";
const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp',verifyOTP);
router.post('/login/password', loginWithPassword);
export default router;
