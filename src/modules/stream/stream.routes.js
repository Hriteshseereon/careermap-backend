import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin} from "../../middlewares/protectAdmin.js";
import {
  createStreamController,
  getStreamsController,
  updateStreamController,
  deleteStreamController,
} from "./stream.controller.js";

const router = Router();

router.post("/", protectAdmin, upload.single("image"), createStreamController);
router.get("/", getStreamsController);
router.put("/:id", protectAdmin, upload.single("image"), updateStreamController);
router.delete("/:id", protectAdmin, deleteStreamController);

export default router;