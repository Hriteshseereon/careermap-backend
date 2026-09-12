import express from "express";

import {
  assessmentController
} from "./psychoassessment.controller.js";

// Use your existing middleware
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { optionalAuth } from "../../middlewares/optionalAuth.js";

import {
protectAuth 
} from "../../middlewares/protectAuth.js";


const router = express.Router();


// ============================================================
// ADMIN
// ============================================================

router.post(
  "/admin/assessments",
  protectAdmin,
  assessmentController.createAssessment
);


router.post(
  "/admin/assessments/:assessmentId/sections",
  protectAdmin,
  assessmentController.createSection
);


router.post(
  "/admin/assessment-sections/:sectionId/questions",
  protectAdmin,
  assessmentController.createQuestion
);


router.post(
  "/admin/questions/:questionId/options",
  protectAdmin,
  assessmentController.createOptions
);


router.post(
  "/admin/career-clusters",
  protectAdmin,
  assessmentController.createCareerCluster
);


router.post(
  "/admin/career-clusters/:clusterId/weights",
  protectAdmin,
  assessmentController.createCareerClusterWeight
);


// ============================================================
// USER
// ============================================================

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