import express from "express";
import upload from "../../middlewares/upload.js";
import {
  createCareerNewsletterController,
  getCareerNewslettersController,
  getCareerNewsletterByIdController,
  updateCareerNewsletterController,
  deleteCareerNewsletterController,
} from "./careernewsletter.controller.js";


const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  createCareerNewsletterController
);

router.get("/", getCareerNewslettersController);

router.get("/:id", getCareerNewsletterByIdController);

router.put(
  "/:id",
  upload.single("image"),
  updateCareerNewsletterController
);

router.delete("/:id", deleteCareerNewsletterController);

export default router;