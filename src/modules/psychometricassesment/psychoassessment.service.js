import {
  assessmentRepository
} from "./psychoassessment.repository.js";

import {
  calculateScores,
  calculateHollandCode,
  calculateClusterMatches
} from "./psychoassessment.engine.js";


export const assessmentService = {

  // =========================================================
  // ADMIN
  // =========================================================

  createAssessment: async (body) => {

    if (!body.title) {
      throw new Error(
        "Assessment title is required"
      );
    }

    if (!body.slug) {
      throw new Error(
        "Assessment slug is required"
      );
    }

    return assessmentRepository
      .createAssessment({
        title: body.title,
        slug: body.slug,
        description:
          body.description || null,
        version:
          body.version || "1.0",
        status:
          body.status || "draft"
      });

  },


  createSection: async (
    assessmentId,
    body
  ) => {

    const assessment =
      await assessmentRepository
        .findAssessmentById(
          assessmentId
        );

    if (!assessment) {
      throw new Error(
        "Assessment not found"
      );
    }

    return assessmentRepository
      .createSection({
        assessmentId:
          Number(assessmentId),

        code: body.code,

        title: body.title,

        description:
          body.description || null,

        order:
          Number(body.order)
      });

  },


  createQuestion: async (
    sectionId,
    body
  ) => {

    if (!body.itemId) {
      throw new Error(
        "itemId is required"
      );
    }

    if (!body.text) {
      throw new Error(
        "Question text is required"
      );
    }

    if (!body.type) {
      throw new Error(
        "Question type is required"
      );
    }

    return assessmentRepository
      .createQuestion({

        sectionId:
          Number(sectionId),

        itemId:
          body.itemId,

        text:
          body.text,

        type:
          body.type,

        facet:
          body.facet || null,

        reverse:
          Boolean(body.reverse),

        image:
          body.image || null,

        note:
          body.note || null,

        order:
          Number(body.order)
      });

  },


  createOptions: async (
    questionId,
    options
  ) => {

    if (
      !Array.isArray(options) ||
      !options.length
    ) {
      throw new Error(
        "Options are required"
      );
    }

    const question =
      await assessmentRepository
        .findQuestionById(
          questionId
        );

    if (!question) {
      throw new Error(
        "Question not found"
      );
    }

    // Likert question does not need DB options
    if (
      question.type === "likert5"
    ) {
      throw new Error(
        "Likert question does not require options"
      );
    }

    const correctCount =
      options.filter(
        (option) =>
          option.isCorrect === true
      ).length;

    if (correctCount !== 1) {
      throw new Error(
        "Exactly one option must be correct"
      );
    }

    return assessmentRepository
      .createOptions(
        questionId,
        options
      );

  },


  // =========================================================
  // USER
  // =========================================================

  getAssessment: async (
    assessmentId
  ) => {

    const assessment =
      await assessmentRepository
        .findPublishedAssessmentById(
          assessmentId
        );

    if (!assessment) {
      throw new Error(
        "Published assessment not found"
      );
    }

    return assessment;

  },


  startAttempt: async (
    userId,
    assessmentId
  ) => {

    const assessment =
      await assessmentRepository
        .findPublishedAssessmentById(
          assessmentId
        );

    if (!assessment) {
      throw new Error(
        "Published assessment not found"
      );
    }

    const attempt =
      await assessmentRepository
        .createAttempt({

          assessmentId:
            Number(assessmentId),

          userId:
            Number(userId),

          status:
            "in_progress"

        });

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      status: attempt.status,
      startedAt: attempt.startedAt
    };

  },


  getAttemptQuestions: async (
    userId,
    attemptId
  ) => {

    const attempt =
      await assessmentRepository
        .findAttemptById(
          attemptId
        );

    if (!attempt) {
      throw new Error(
        "Attempt not found"
      );
    }

    if (
      Number(attempt.userId) !==
      Number(userId)
    ) {
      throw new Error(
        "You are not allowed to access this attempt"
      );
    }

    if (
      attempt.status ===
      "completed"
    ) {
      throw new Error(
        "Assessment already completed"
      );
    }

    return attempt.assessment.sections;

  },


  saveAnswer: async (
    userId,
    attemptId,
    body
  ) => {

    const attempt =
      await assessmentRepository
        .findAttemptById(
          attemptId
        );

    if (!attempt) {
      throw new Error(
        "Attempt not found"
      );
    }

    if (
      Number(attempt.userId) !==
      Number(userId)
    ) {
      throw new Error(
        "You are not allowed to answer this attempt"
      );
    }

    if (
      attempt.status !==
      "in_progress"
    ) {
      throw new Error(
        "Attempt is not active"
      );
    }

    const question =
      await assessmentRepository
        .findQuestionById(
          body.questionId
        );

    if (!question) {
      throw new Error(
        "Question not found"
      );
    }

    if (
      question.section.assessmentId !==
      attempt.assessmentId
    ) {
      throw new Error(
        "Question does not belong to this assessment"
      );
    }


    // ============================================
    // LIKERT
    // ============================================

    if (
      question.type ===
      "likert5"
    ) {

      const value =
        Number(body.likertValue);

      if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 5
      ) {
        throw new Error(
          "Likert value must be between 1 and 5"
        );
      }

      return assessmentRepository
        .upsertAnswer({

          attemptId,

          questionId:
            question.id,

          likertValue:
            value,

          selectedOptionId:
            null

        });

    }


    // ============================================
    // MCQ
    // ============================================

    if (
      !body.selectedOptionId
    ) {
      throw new Error(
        "selectedOptionId is required"
      );
    }

    const selectedOption =
      question.options.find(
        (option) =>
          option.id ===
          Number(
            body.selectedOptionId
          )
      );

    if (!selectedOption) {
      throw new Error(
        "Invalid option for this question"
      );
    }

    return assessmentRepository
      .upsertAnswer({

        attemptId,

        questionId:
          question.id,

        selectedOptionId:
          selectedOption.id,

        likertValue:
          null

      });

  },


  // =========================================================
  // SUBMIT
  // =========================================================

  submitAttempt: async (
    userId,
    attemptId
  ) => {

    const attempt =
      await assessmentRepository
        .findAttemptById(
          attemptId
        );

    if (!attempt) {
      throw new Error(
        "Attempt not found"
      );
    }

    if (
      Number(attempt.userId) !==
      Number(userId)
    ) {
      throw new Error(
        "You are not allowed to submit this attempt"
      );
    }

    if (
      attempt.status ===
      "completed"
    ) {

      const existingResult =
        await assessmentRepository
          .findResultByAttemptId(
            attemptId
          );

      return existingResult;

    }


    // ==========================================
    // ALL QUESTIONS
    // ==========================================

    const questions =
      attempt.assessment.sections
        .flatMap(
          (section) =>
            section.questions
        );


    // ==========================================
    // CHECK ALL ANSWERED
    // ==========================================

    const answeredQuestionIds =
      new Set(
        attempt.answers.map(
          (answer) =>
            answer.questionId
        )
      );

    const unanswered =
      questions.filter(
        (question) =>
          !answeredQuestionIds.has(
            question.id
          )
      );

    if (unanswered.length) {

      throw new Error(
        `Please answer all questions. Missing: ${unanswered.length}`
      );

    }


    // ==========================================
    // CALCULATE SCORES
    // ==========================================

    const scores =
      calculateScores(
        questions,
        attempt.answers
      );


    // ==========================================
    // HOLLAND CODE
    // ==========================================

    const hollandCode =
      calculateHollandCode(
        scores
      );


    // ==========================================
    // CAREER CLUSTERS
    // ==========================================

    const clusters =
      await assessmentRepository
        .getCareerClusters();


    const rankedClusters =
      calculateClusterMatches(
        scores,
        clusters
      );


    const top5 =
      rankedClusters
        .slice(0, 5);


    const top1 =
      top5[0] || null;


    // ==========================================
    // SAVE RESULT
    // ==========================================

    const result =
      await assessmentRepository
        .createResult({

          attemptId:
            Number(attemptId),

          hollandCode,

          topCareerCluster:
            top1?.name || null,

          topCareerMatch:
            top1
              ? Math.round(
                  top1.match * 100
                )
              : null,

          scores,

          top5Clusters:
            top5.map(
              (cluster) => ({
                clusterId:
                  cluster.clusterId,

                code:
                  cluster.code,

                cluster:
                  cluster.name,

                match:
                  Math.round(
                    cluster.match * 100
                  )
              })
            )

        });


    // ==========================================
    // COMPLETE ATTEMPT
    // ==========================================

    await assessmentRepository
      .completeAttempt(
        attemptId
      );


    return result;

  },


  // =========================================================
  // GET RESULT
  // =========================================================

  getResult: async (
    userId,
    attemptId
  ) => {

    const attempt =
      await assessmentRepository
        .findAttemptById(
          attemptId
        );

    if (!attempt) {
      throw new Error(
        "Attempt not found"
      );
    }

    if (
      Number(attempt.userId) !==
      Number(userId)
    ) {
      throw new Error(
        "You are not allowed to access this result"
      );
    }

    const result =
      await assessmentRepository
        .findResultByAttemptId(
          attemptId
        );

    if (!result) {
      throw new Error(
        "Result not generated yet"
      );
    }

    return result;

  },


  // =========================================================
  // CAREER CLUSTER
  // =========================================================

  createCareerCluster: async (
    body
  ) => {

    return assessmentRepository
      .createCareerCluster({

        code:
          body.code,

        name:
          body.name,

        hollandCode:
          body.hollandCode || null,

        description:
          body.description || null

      });

  },


  createCareerClusterWeight: async (
    clusterId,
    body
  ) => {

    return assessmentRepository
      .createCareerClusterWeight({

        clusterId:
          Number(clusterId),

        facet:
          body.facet,

        weight:
          Number(body.weight)

      });

  }

};