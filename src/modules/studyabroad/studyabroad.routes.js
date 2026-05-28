import { Router } from "express";

import {
  createStudyAbroadController,
  getStudyAbroadController,
  getStudyAbroadByIdController,
  updateStudyAbroadController,
  deleteStudyAbroadController,

  createStudyAbroadConsultController,
  getStudyAbroadConsultController,
  getStudyAbroadConsultByIdController,
  updateStudyAbroadConsultController,
  deleteStudyAbroadConsultController,

} from "./studyabroad.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { protectAuth } from "../../middlewares/protectAuth.js";

const router = Router();


// 🔥 STUDY ABROAD CRUD

router.post("/", protectAdmin, createStudyAbroadController);

router.get("/", getStudyAbroadController);

router.get("/:id", getStudyAbroadByIdController);

router.put("/:id", protectAdmin, updateStudyAbroadController);

router.delete("/:id", protectAdmin, deleteStudyAbroadController);


// ====================================================
// 🔥 CONSULT ROUTES
// ====================================================

// USER CREATE CONSULT
router.post(
  "/consult/create",
  protectAuth,
  createStudyAbroadConsultController
);

// ADMIN GET ALL CONSULTS
router.get(
  "/consult/all",
  protectAdmin,
  getStudyAbroadConsultController
);

// ADMIN GET SINGLE CONSULT
router.get(
  "/consult/:id",
  protectAdmin,
  getStudyAbroadConsultByIdController
);

// ADMIN UPDATE CONSULT
router.put(
  "/consult/:id",
  protectAdmin,
  updateStudyAbroadConsultController
);

// ADMIN DELETE CONSULT
router.delete(
  "/consult/:id",
  protectAdmin,
  deleteStudyAbroadConsultController
);

export default router;