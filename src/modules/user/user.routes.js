import { Router } from "express";
import {signup} from "./user.controller.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectTemp } from "../../middlewares/protectTemp.js";
const router = Router();

router.post('/signup', protectTemp, signup);

export default router;
    