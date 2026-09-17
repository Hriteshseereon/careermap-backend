import express from "express";

import {
  assessmentController
} from "./psychoassessment.controller.js";

import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { protectAuth } from "../../middlewares/protectAuth.js";

const router = express.Router();


// ============================================================
// ADMIN: ASSESSMENTS
// ============================================================

router.post(
  "/admin/assessments/seed-defaults",
  protectAdmin,
  assessmentController.seedDefaultAssessmentAndQuestions
);

router.post(
  "/admin/questions/seed-defaults",
  protectAdmin,
  assessmentController.seedDefaultAssessmentAndQuestions
);

router.post(
  "/admin/assessments",
  protectAdmin,
  assessmentController.createAssessment
);

router.get(
  "/admin/assessments",
  protectAdmin,
  assessmentController.getAllAssessments
);

router.get(
  "/admin/assessments/:assessmentId",
  protectAdmin,
  assessmentController.getAssessmentByIdAdmin
);

router.put(
  "/admin/assessments/:assessmentId",
  protectAdmin,
  assessmentController.updateAssessment
);

router.patch(
  "/admin/assessments/:assessmentId/status",
  protectAdmin,
  assessmentController.updateAssessmentStatus
);

router.delete(
  "/admin/assessments/:assessmentId",
  protectAdmin,
  assessmentController.deleteAssessment
);


// ============================================================
// ADMIN: SECTIONS
// ============================================================

router.post(
  "/admin/assessments/:assessmentId/sections",
  protectAdmin,
  assessmentController.createSection
);

router.get(
  "/admin/sections",
  protectAdmin,
  assessmentController.getAllSections
);

router.get(
  "/admin/assessments/:assessmentId/sections",
  protectAdmin,
  assessmentController.getSectionsByAssessment
);

router.get(
  "/admin/sections/:sectionId",
  protectAdmin,
  assessmentController.getSectionById
);

router.put(
  "/admin/sections/:sectionId",
  protectAdmin,
  assessmentController.updateSection
);

router.delete(
  "/admin/sections/:sectionId",
  protectAdmin,
  assessmentController.deleteSection
);


// ============================================================
// ADMIN: QUESTIONS
// ============================================================

router.post(
  "/admin/assessment-sections/:sectionId/questions",
  protectAdmin,
  assessmentController.createQuestion
);

router.post(
  "/admin/sections/:sectionId/questions",
  protectAdmin,
  assessmentController.createQuestion
);

router.get(
  "/admin/sections/:sectionId/questions",
  protectAdmin,
  assessmentController.getQuestionsBySection
);

router.get(
  "/admin/assessments/:assessmentId/questions",
  protectAdmin,
  assessmentController.getQuestionsByAssessment
);

router.get(
  "/admin/questions",
  protectAdmin,
  assessmentController.getAllQuestions
);

router.get(
  "/admin/questions/:questionId",
  protectAdmin,
  assessmentController.getQuestionById
);

router.put(
  "/admin/questions/:questionId",
  protectAdmin,
  assessmentController.updateQuestion
);

router.delete(
  "/admin/questions/:questionId",
  protectAdmin,
  assessmentController.deleteQuestion
);


// ============================================================
// ADMIN: OPTIONS
// ============================================================

router.post(
  "/admin/questions/:questionId/options",
  protectAdmin,
  assessmentController.createOptions
);

router.get(
  "/admin/questions/:questionId/options",
  protectAdmin,
  assessmentController.getOptionsByQuestion
);

router.put(
  "/admin/questions/:questionId/options",
  protectAdmin,
  assessmentController.updateOptionsForQuestion
);

router.put(
  "/admin/options/:optionId",
  protectAdmin,
  assessmentController.updateSingleOption
);

router.delete(
  "/admin/options/:optionId",
  protectAdmin,
  assessmentController.deleteSingleOption
);


// ============================================================
// ADMIN: CAREER CLUSTERS & WEIGHTS
// ============================================================

router.post(
  "/admin/career-clusters/seed-defaults",
  protectAdmin,
  assessmentController.seedDefaultCareerClusters
);

router.post(
  "/admin/career-clusters/bulk-import",
  protectAdmin,
  assessmentController.bulkImportCareerClusters
);

router.post(
  "/admin/career-clusters",
  protectAdmin,
  assessmentController.createCareerCluster
);

router.get(
  "/admin/career-clusters",
  protectAdmin,
  assessmentController.getAllCareerClusters
);

router.get(
  "/admin/career-clusters/:clusterId",
  protectAdmin,
  assessmentController.getCareerClusterById
);

router.put(
  "/admin/career-clusters/:clusterId",
  protectAdmin,
  assessmentController.updateCareerCluster
);

router.delete(
  "/admin/career-clusters/:clusterId",
  protectAdmin,
  assessmentController.deleteCareerCluster
);

router.post(
  "/admin/career-clusters/:clusterId/weights",
  protectAdmin,
  assessmentController.createCareerClusterWeight
);

router.get(
  "/admin/career-clusters/:clusterId/weights",
  protectAdmin,
  assessmentController.getWeightsByCluster
);

router.put(
  "/admin/career-clusters/:clusterId/weights",
  protectAdmin,
  assessmentController.bulkUpdateClusterWeights
);

router.put(
  "/admin/career-cluster-weights/:weightId",
  protectAdmin,
  assessmentController.updateSingleClusterWeight
);

router.delete(
  "/admin/career-cluster-weights/:weightId",
  protectAdmin,
  assessmentController.deleteSingleClusterWeight
);


// ============================================================
// ADMIN: ATTEMPTS & RESULTS MANAGEMENT
// ============================================================

router.get(
  "/admin/attempts",
  protectAdmin,
  assessmentController.getAllAttemptsAdmin
);

router.get(
  "/admin/attempts/:attemptId",
  protectAdmin,
  assessmentController.getAttemptByIdAdmin
);

router.delete(
  "/admin/attempts/:attemptId",
  protectAdmin,
  assessmentController.deleteAttemptAdmin
);

router.post(
  "/admin/attempts/:attemptId/recalculate",
  protectAdmin,
  assessmentController.recalculateAttempt
);


// ============================================================
// USER: ASSESSMENTS & TEST TAKING
// ============================================================

router.get(
  "/assessments",
  protectAuth,
  assessmentController.getPublishedAssessments
);

router.get(
  "/assessment/my-attempts",
  protectAuth,
  assessmentController.getMyAttempts
);

router.get(
  "/assessment/:assessmentId",
  protectAuth,
  assessmentController.getAssessment
);

router.post(
  "/assessment/:assessmentId/start",
  protectAuth,
  assessmentController.startAttempt
);

router.get(
  "/assessment/attempt/:attemptId/status",
  protectAuth,
  assessmentController.getAttemptStatus
);

router.get(
  "/assessment/attempt/:attemptId/questions",
  protectAuth,
  assessmentController.getAttemptQuestions
);

router.post(
  "/assessment/attempt/:attemptId/answer",
  protectAuth,
  assessmentController.saveAnswer
);

router.post(
  "/assessment/attempt/:attemptId/batch-answers",
  protectAuth,
  assessmentController.saveBatchAnswers
);

router.post(
  "/assessment/attempt/:attemptId/submit",
  protectAuth,
  assessmentController.submitAttempt
);

router.get(
  "/assessment/attempt/:attemptId/result",
  protectAuth,
  assessmentController.getResult
);


export default router;