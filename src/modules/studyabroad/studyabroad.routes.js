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
import {protectAuth} from "../../middlewares/protectAuth.js"
const router = Router();

router.post("/", protectAdmin, createStudyAbroadController);
router.get("/", getStudyAbroadController);
router.get("/:id", getStudyAbroadByIdController);
router.put("/:id", protectAdmin, updateStudyAbroadController);
router.delete("/:id", protectAdmin, deleteStudyAbroadController);

// USER CREATE CONSULT
router.post("/", protectAuth, createStudyAbroadConsultController);

// ADMIN GET ALL CONSULTS
router.get("/", protectAdmin, getStudyAbroadConsultController);

// ADMIN GET SINGLE CONSULT
router.get("/:id", protectAdmin, getStudyAbroadConsultByIdController);

// ADMIN UPDATE STATUS
router.put("/:id", protectAdmin, updateStudyAbroadConsultController);

// ADMIN DELETE
router.delete("/:id", protectAdmin, deleteStudyAbroadConsultController);

export default router;