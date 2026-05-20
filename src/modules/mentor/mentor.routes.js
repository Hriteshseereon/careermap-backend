import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

import {
  createMentorController,
  getMentorsController,
  getMentorByIdController,
  updateMentorController,
  deleteMentorController,
} from "./mentor.controller.js";

const router = Router();

// 🔹 CREATE
router.post(
  "/",
  protectAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  createMentorController
);

// 🔹 GET
router.get("/", getMentorsController);
router.get("/:id", getMentorByIdController);

// 🔹 UPDATE
router.put(
  "/:id",
  protectAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateMentorController
);

// 🔹 DELETE
router.delete("/:id", protectAdmin, deleteMentorController);

export default router;