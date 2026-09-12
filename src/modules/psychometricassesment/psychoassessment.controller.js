import {
  assessmentService
} from "./psychoassessment.service.js";


export const assessmentController = {

  // =========================================================
  // ADMIN
  // =========================================================

  createAssessment: async (req, res) => {

    try {

      const result =
        await assessmentService
          .createAssessment(req.body);

      return res.status(201).json({
        success: true,
        message:
          "Assessment created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  createSection: async (req, res) => {

    try {

      const result =
        await assessmentService
          .createSection(
            req.params.assessmentId,
            req.body
          );

      return res.status(201).json({
        success: true,
        message:
          "Section created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  createQuestion: async (req, res) => {

    try {

      const result =
        await assessmentService
          .createQuestion(
            req.params.sectionId,
            req.body
          );

      return res.status(201).json({
        success: true,
        message:
          "Question created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  createOptions: async (req, res) => {

    try {

      const result =
        await assessmentService
          .createOptions(
            req.params.questionId,
            req.body.options
          );

      return res.status(201).json({
        success: true,
        message:
          "Options created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  createCareerCluster: async (req, res) => {

    try {

      const result =
        await assessmentService
          .createCareerCluster(
            req.body
          );

      return res.status(201).json({
        success: true,
        message:
          "Career cluster created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  createCareerClusterWeight: async (
    req,
    res
  ) => {

    try {

      const result =
        await assessmentService
          .createCareerClusterWeight(
            req.params.clusterId,
            req.body
          );

      return res.status(201).json({
        success: true,
        message:
          "Cluster weight created successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  // =========================================================
  // USER
  // =========================================================

  getAssessment: async (req, res) => {

    try {

      const result =
        await assessmentService
          .getAssessment(
            req.params.assessmentId
          );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {

      return res.status(404).json({
        success: false,
        message: error.message
      });

    }

  },


  startAttempt: async (req, res) => {

    try {

      // Adjust this according to your JWT payload.
      const userId =
        req.user.userId;

      const result =
        await assessmentService
          .startAttempt(
            userId,
            req.params.assessmentId
          );

      return res.status(201).json({
        success: true,
        message:
          "Assessment started successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  getAttemptQuestions: async (
    req,
    res
  ) => {

    try {

      const userId =
        req.user.userId;

      const result =
        await assessmentService
          .getAttemptQuestions(
            userId,
            req.params.attemptId
          );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  saveAnswer: async (
    req,
    res
  ) => {

    try {

      const userId =
        req.user.userId;

      const result =
        await assessmentService
          .saveAnswer(
            userId,
            req.params.attemptId,
            req.body
          );

      return res.status(200).json({
        success: true,
        message:
          "Answer saved successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  submitAttempt: async (
    req,
    res
  ) => {

    try {

      const userId =
        req.user.userId;

      const result =
        await assessmentService
          .submitAttempt(
            userId,
            req.params.attemptId
          );

      return res.status(200).json({
        success: true,
        message:
          "Assessment submitted successfully",
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  },


  getResult: async (
    req,
    res
  ) => {

    try {

      const userId =
        req.user.userId;

      const result =
        await assessmentService
          .getResult(
            userId,
            req.params.attemptId
          );

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }

};