import { Router } from "express";
import {
  createQuizController,
  addQuestionController,
  getAllQuizController,
  getQuizByIdController,
  updateQuizController,
  deleteQuizController,
   updateQuestionController,
  deleteQuestionController,
  getQuestionByIdController,
  getQuizForUserController,
  submitQuizController
} from "./quiz.controller.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
const router = Router();

router.post("/", protectAdmin, createQuizController);
router.post("/question", protectAdmin, addQuestionController);

// 🔥 USER ROUTES (PUT ABOVE)
router.get("/user/:id", getQuizForUserController);
router.post("/submit-quiz", submitQuizController);

// 🔹 QUESTION ROUTES
router.get("/question/:id", getQuestionByIdController);
router.put("/question/:id", updateQuestionController);
router.delete("/question/:id", deleteQuestionController);

// 🔹 GENERAL QUIZ ROUTES
router.get("/", getAllQuizController);
router.get("/:id", getQuizByIdController); // ✅ LAST

router.put("/:id", protectAdmin, updateQuizController);
router.delete("/:id", protectAdmin, deleteQuizController);

export default router;