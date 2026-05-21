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
} from "./quiz.controller.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
const router = Router();

router.post("/",protectAdmin, createQuizController);
router.post("/question",protectAdmin,  addQuestionController);

router.get("/", getAllQuizController);
router.get("/:id", getQuizByIdController);

router.put("/:id", protectAdmin, updateQuizController);
router.delete("/:id", protectAdmin, deleteQuizController);
router.put("/question/:id", updateQuestionController);
router.delete("/question/:id", deleteQuestionController);
router.get("/question/:id", getQuestionByIdController);
export default router;