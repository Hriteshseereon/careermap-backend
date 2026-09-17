import {
  assessmentRepository
} from "./psychoassessment.repository.js";

import {
  calculateScores,
  calculateHollandCode,
  calculateClusterMatches,
  buildAssessmentReport,
  normalizeSectionCode
} from "./psychoassessment.engine.js";

import {
  seedCareerClustersToDatabase
} from "./psychoassessment.seed.js";

import {
  seedAssessmentAndQuestions
} from "./psychoassessment.questions.seed.js";


function generateQuestionItemId(sectionCode, facet, count = 1) {
  const code = normalizeSectionCode(sectionCode || "");
  let prefix = "Q";
  if (code === "interest") prefix = "INT";
  else if (code === "personality") prefix = "PER";
  else if (code === "values") prefix = "VAL";
  else if (code === "learning_style") prefix = "VARK";
  else if (code === "goal_orientation") prefix = "GOAL";
  else if (code === "aptitude") prefix = "APT";

  const facetPart = facet ? `_${String(facet).toUpperCase().replace(/[^A-Z0-9]/g, "")}` : "";
  const numPart = String(count).padStart(2, "0");
  return `${prefix}${facetPart}_${numPart}`;
}

export const assessmentService = {

  // =========================================================
  // ADMIN: ASSESSMENTS
  // =========================================================

  createAssessment: async (body) => {
    if (!body.title) {
      throw new Error("Assessment title is required");
    }

    if (!body.slug) {
      throw new Error("Assessment slug is required");
    }

    const existingSlug = await assessmentRepository.findAssessmentBySlug(body.slug);
    if (existingSlug) {
      throw new Error(`Assessment with slug "${body.slug}" already exists`);
    }

    return assessmentRepository.createAssessment({
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      version: body.version || "1.0",
      status: body.status || "draft"
    });
  },

  seedDefaultAssessmentAndQuestions: async (targetAssessmentId = null) => {
    return seedAssessmentAndQuestions(targetAssessmentId);
  },

  getAllAssessments: async (query = {}) => {
    const { status, search, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [assessments, total] = await Promise.all([
      assessmentRepository.findAllAssessments({
        status,
        search,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countAssessments({ status, search })
    ]);

    return {
      assessments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getAssessmentByIdAdmin: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    return assessment;
  },

  updateAssessment: async (assessmentId, body) => {
    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await assessmentRepository.findAssessmentBySlug(body.slug);
      if (slugConflict && slugConflict.id !== Number(assessmentId)) {
        throw new Error(`Assessment with slug "${body.slug}" already exists`);
      }
    }

    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.version !== undefined) updateData.version = body.version;
    if (body.status !== undefined) updateData.status = body.status;

    return assessmentRepository.updateAssessment(assessmentId, updateData);
  },

  updateAssessmentStatus: async (assessmentId, status) => {
    const validStatuses = ["draft", "published", "archived"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.updateAssessment(assessmentId, { status });
  },

  deleteAssessment: async (assessmentId) => {
    const existing = await assessmentRepository.findAssessmentById(assessmentId);
    if (!existing) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.deleteAssessment(assessmentId);
  },


  // =========================================================
  // ADMIN: SECTIONS
  // =========================================================

  createSection: async (assessmentId, body) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    if (!body.code) {
      throw new Error("Section code is required (e.g. 'interest', 'personality', 'values', 'aptitude', 'learning_style', 'goal_orientation')");
    }

    if (!body.title) {
      throw new Error("Section title is required");
    }

    const normalizedCode = normalizeSectionCode(body.code);

    const existingSection = await assessmentRepository.findSectionByCode(assessmentId, normalizedCode);
    if (existingSection) {
      throw new Error(`Section with code "${normalizedCode}" already exists in this assessment`);
    }

    return assessmentRepository.createSection({
      assessmentId: Number(assessmentId),
      code: normalizedCode,
      title: body.title,
      description: body.description || null,
      order: body.order !== undefined ? Number(body.order) : 0
    });
  },

  getAllSections: async (query = {}) => {
    const { assessmentId, search, page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [sections, total] = await Promise.all([
      assessmentRepository.findAllSections({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        search,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countSections({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        search
      })
    ]);

    return {
      sections,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getSectionsByAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.findSectionsByAssessmentId(assessmentId);
  },

  getSectionById: async (sectionId) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }
    return section;
  },

  updateSection: async (sectionId, body) => {
    const existing = await assessmentRepository.findSectionById(sectionId);
    if (!existing) {
      throw new Error("Section not found");
    }

    const updateData = {};
    if (body.code !== undefined) updateData.code = normalizeSectionCode(body.code);
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = Number(body.order);

    return assessmentRepository.updateSection(sectionId, updateData);
  },

  deleteSection: async (sectionId) => {
    const existing = await assessmentRepository.findSectionById(sectionId);
    if (!existing) {
      throw new Error("Section not found");
    }

    return assessmentRepository.deleteSection(sectionId);
  },


  // =========================================================
  // ADMIN: QUESTIONS
  // =========================================================

  createQuestion: async (sectionId, body) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    if (!body.text) {
      throw new Error("Question text is required");
    }

    if (!body.type) {
      throw new Error("Question type is required ('likert5' or 'mcq')");
    }

    // Auto-generate item code (itemId) if not manually supplied
    let itemId = body.itemId ? String(body.itemId).trim() : null;
    if (!itemId) {
      const questionsCount = await assessmentRepository.countQuestionsBySectionId(sectionId);
      itemId = generateQuestionItemId(section.code, body.facet, questionsCount + 1);

      let counter = questionsCount + 1;
      let existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      while (existingQuestion) {
        counter += 1;
        itemId = generateQuestionItemId(section.code, body.facet, counter);
        existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      }
    } else {
      const existingQuestion = await assessmentRepository.findQuestionByItemId(sectionId, itemId);
      if (existingQuestion) {
        throw new Error(`Question with itemId "${itemId}" already exists in this section`);
      }
    }

    const question = await assessmentRepository.createQuestion({
      sectionId: Number(sectionId),
      itemId,
      text: body.text,
      type: body.type,
      facet: body.facet || null,
      reverse: Boolean(body.reverse),
      image: body.image || null,
      note: body.note || null,
      order: body.order !== undefined ? Number(body.order) : 0
    });

    // Optionally create options inline for MCQ
    if (body.type === "mcq" && Array.isArray(body.options) && body.options.length > 0) {
      await assessmentRepository.createOptions(question.id, body.options);
      return assessmentRepository.findQuestionById(question.id);
    }

    return question;
  },

  getAllQuestions: async (query = {}) => {
    const {
      assessmentId,
      sectionId,
      search,
      type,
      facet,
      page = 1,
      limit = 50
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      assessmentRepository.findAllQuestions({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        sectionId: sectionId ? Number(sectionId) : undefined,
        search,
        type,
        facet,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countQuestions({
        assessmentId: assessmentId ? Number(assessmentId) : undefined,
        sectionId: sectionId ? Number(sectionId) : undefined,
        search,
        type,
        facet
      })
    ]);

    return {
      questions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getQuestionsBySection: async (sectionId) => {
    const section = await assessmentRepository.findSectionById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    return assessmentRepository.findQuestionsBySectionId(sectionId);
  },

  getQuestionsByAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    return assessmentRepository.findQuestionsByAssessmentId(assessmentId);
  },

  getQuestionById: async (questionId) => {
    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    return question;
  },

  updateQuestion: async (questionId, body) => {
    const existing = await assessmentRepository.findQuestionById(questionId);
    if (!existing) {
      throw new Error("Question not found");
    }

    const updateData = {};
    if (body.itemId !== undefined) updateData.itemId = body.itemId;
    if (body.text !== undefined) updateData.text = body.text;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.facet !== undefined) updateData.facet = body.facet;
    if (body.reverse !== undefined) updateData.reverse = Boolean(body.reverse);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.note !== undefined) updateData.note = body.note;
    if (body.order !== undefined) updateData.order = Number(body.order);

    const updated = await assessmentRepository.updateQuestion(questionId, updateData);

    // If options are provided for MCQ, replace options
    if (Array.isArray(body.options)) {
      await assessmentRepository.deleteOptionsByQuestionId(questionId);
      if (body.options.length > 0) {
        await assessmentRepository.createOptions(questionId, body.options);
      }
      return assessmentRepository.findQuestionById(questionId);
    }

    return updated;
  },

  deleteQuestion: async (questionId) => {
    const existing = await assessmentRepository.findQuestionById(questionId);
    if (!existing) {
      throw new Error("Question not found");
    }

    return assessmentRepository.deleteQuestion(questionId);
  },


  // =========================================================
  // ADMIN: OPTIONS
  // =========================================================

  createOptions: async (questionId, options) => {
    if (!Array.isArray(options) || !options.length) {
      throw new Error("Options array is required");
    }

    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.type === "likert5") {
      throw new Error("Likert-scale questions do not require custom options");
    }

    const correctCount = options.filter((opt) => opt.isCorrect === true).length;
    if (correctCount !== 1) {
      throw new Error("Exactly one option must be marked as correct (isCorrect: true)");
    }

    await assessmentRepository.createOptions(questionId, options);
    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  getOptionsByQuestion: async (questionId) => {
    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  updateOptionsForQuestion: async (questionId, options) => {
    if (!Array.isArray(options) || !options.length) {
      throw new Error("Options array is required");
    }

    const question = await assessmentRepository.findQuestionById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const correctCount = options.filter((opt) => opt.isCorrect === true).length;
    if (correctCount !== 1) {
      throw new Error("Exactly one option must be marked as correct (isCorrect: true)");
    }

    await assessmentRepository.deleteOptionsByQuestionId(questionId);
    await assessmentRepository.createOptions(questionId, options);
    return assessmentRepository.findOptionsByQuestionId(questionId);
  },

  updateSingleOption: async (optionId, body) => {
    const existing = await assessmentRepository.findOptionById(optionId);
    if (!existing) {
      throw new Error("Option not found");
    }

    const updateData = {};
    if (body.optionText !== undefined) updateData.optionText = body.optionText;
    if (body.optionIndex !== undefined) updateData.optionIndex = Number(body.optionIndex);
    if (body.isCorrect !== undefined) updateData.isCorrect = Boolean(body.isCorrect);
    if (body.image !== undefined) updateData.image = body.image;

    return assessmentRepository.updateOption(optionId, updateData);
  },

  deleteSingleOption: async (optionId) => {
    const existing = await assessmentRepository.findOptionById(optionId);
    if (!existing) {
      throw new Error("Option not found");
    }

    return assessmentRepository.deleteOption(optionId);
  },


  // =========================================================
  // ADMIN: CAREER CLUSTERS & WEIGHTS
  // =========================================================

  createCareerCluster: async (body) => {
    if (!body.code) {
      throw new Error("Career cluster code is required (e.g. 'ENG_TECH', 'HEALTH_SCI')");
    }

    if (!body.name) {
      throw new Error("Career cluster name is required");
    }

    const existing = await assessmentRepository.findCareerClusterByCode(body.code);
    if (existing) {
      throw new Error(`Career cluster with code "${body.code}" already exists`);
    }

    const cluster = await assessmentRepository.createCareerCluster({
      code: body.code,
      name: body.name,
      hollandCode: body.hollandCode || null,
      description: body.description || null
    });

    // If weights are provided inline (as array or object)
    if (body.weights && typeof body.weights === "object") {
      const weightsList = Array.isArray(body.weights)
        ? body.weights
        : Object.entries(body.weights).map(([facet, weight]) => ({ facet, weight }));

      for (const w of weightsList) {
        if (w.facet && w.weight !== undefined) {
          await assessmentRepository.upsertCareerClusterWeight(cluster.id, w.facet, Number(w.weight));
        }
      }
      return assessmentRepository.findCareerClusterById(cluster.id);
    }

    return cluster;
  },

  getAllCareerClusters: async () => {
    return assessmentRepository.getCareerClusters();
  },

  seedDefaultCareerClusters: async () => {
    return seedCareerClustersToDatabase();
  },

  bulkImportCareerClusters: async (clustersArray) => {
    if (!Array.isArray(clustersArray) || !clustersArray.length) {
      throw new Error("Clusters array is required");
    }

    const results = [];
    for (const item of clustersArray) {
      if (!item.code || !item.name) continue;

      let cluster = await assessmentRepository.findCareerClusterByCode(item.code);
      if (cluster) {
        cluster = await assessmentRepository.updateCareerCluster(cluster.id, {
          name: item.name,
          hollandCode: item.hollandCode || null,
          description: item.description || null
        });
      } else {
        cluster = await assessmentRepository.createCareerCluster({
          code: item.code,
          name: item.name,
          hollandCode: item.hollandCode || null,
          description: item.description || null
        });
      }

      if (item.weights && typeof item.weights === "object") {
        const weightsList = Array.isArray(item.weights)
          ? item.weights
          : Object.entries(item.weights).map(([facet, weight]) => ({ facet, weight }));

        for (const w of weightsList) {
          if (w.facet && w.weight !== undefined) {
            await assessmentRepository.upsertCareerClusterWeight(cluster.id, w.facet, Number(w.weight));
          }
        }
      }

      results.push(await assessmentRepository.findCareerClusterById(cluster.id));
    }

    return results;
  },

  getCareerClusterById: async (clusterId) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }
    return cluster;
  },

  updateCareerCluster: async (clusterId, body) => {
    const existing = await assessmentRepository.findCareerClusterById(clusterId);
    if (!existing) {
      throw new Error("Career cluster not found");
    }

    if (body.code && body.code !== existing.code) {
      const codeConflict = await assessmentRepository.findCareerClusterByCode(body.code);
      if (codeConflict && codeConflict.id !== Number(clusterId)) {
        throw new Error(`Career cluster with code "${body.code}" already exists`);
      }
    }

    const updateData = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.hollandCode !== undefined) updateData.hollandCode = body.hollandCode;
    if (body.description !== undefined) updateData.description = body.description;

    const updated = await assessmentRepository.updateCareerCluster(clusterId, updateData);

    // If weights are provided, upsert them
    if (body.weights && typeof body.weights === "object") {
      const weightsList = Array.isArray(body.weights)
        ? body.weights
        : Object.entries(body.weights).map(([facet, weight]) => ({ facet, weight }));

      await assessmentRepository.deleteWeightsByClusterId(clusterId);
      for (const w of weightsList) {
        if (w.facet && w.weight !== undefined) {
          await assessmentRepository.upsertCareerClusterWeight(clusterId, w.facet, Number(w.weight));
        }
      }
      return assessmentRepository.findCareerClusterById(clusterId);
    }

    return updated;
  },

  deleteCareerCluster: async (clusterId) => {
    const existing = await assessmentRepository.findCareerClusterById(clusterId);
    if (!existing) {
      throw new Error("Career cluster not found");
    }

    return assessmentRepository.deleteCareerCluster(clusterId);
  },

  createCareerClusterWeight: async (clusterId, body) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    if (!body.facet) {
      throw new Error("Facet is required (e.g. 'R', 'I', 'Mech', 'Log', 'O', 'OC')");
    }

    if (body.weight === undefined || isNaN(Number(body.weight))) {
      throw new Error("Numeric weight value is required");
    }

    return assessmentRepository.upsertCareerClusterWeight(
      clusterId,
      body.facet,
      Number(body.weight)
    );
  },

  getWeightsByCluster: async (clusterId) => {
    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    return assessmentRepository.findWeightsByClusterId(clusterId);
  },

  bulkUpdateClusterWeights: async (clusterId, weightsArray) => {
    if (!Array.isArray(weightsArray)) {
      throw new Error("Weights must be an array of { facet, weight }");
    }

    const cluster = await assessmentRepository.findCareerClusterById(clusterId);
    if (!cluster) {
      throw new Error("Career cluster not found");
    }

    await assessmentRepository.deleteWeightsByClusterId(clusterId);

    for (const item of weightsArray) {
      if (item.facet && item.weight !== undefined) {
        await assessmentRepository.upsertCareerClusterWeight(
          clusterId,
          item.facet,
          Number(item.weight)
        );
      }
    }

    return assessmentRepository.findWeightsByClusterId(clusterId);
  },

  updateSingleClusterWeight: async (weightId, body) => {
    const existing = await assessmentRepository.findWeightById(weightId);
    if (!existing) {
      throw new Error("Cluster weight record not found");
    }

    const updateData = {};
    if (body.facet !== undefined) updateData.facet = body.facet;
    if (body.weight !== undefined) updateData.weight = Number(body.weight);

    return assessmentRepository.updateCareerClusterWeight(weightId, updateData);
  },

  deleteSingleClusterWeight: async (weightId) => {
    const existing = await assessmentRepository.findWeightById(weightId);
    if (!existing) {
      throw new Error("Cluster weight record not found");
    }

    return assessmentRepository.deleteCareerClusterWeight(weightId);
  },


  // =========================================================
  // ADMIN: ATTEMPTS & RESULTS MANAGEMENT
  // =========================================================

  getAllAttemptsAdmin: async (query = {}) => {
    const { assessmentId, userId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const [attempts, total] = await Promise.all([
      assessmentRepository.findAllAttempts({
        assessmentId,
        userId,
        status,
        skip,
        take: Number(limit)
      }),
      assessmentRepository.countAttempts({ assessmentId, userId, status })
    ]);

    return {
      attempts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  },

  getAttemptByIdAdmin: async (attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    return attempt;
  },

  deleteAttemptAdmin: async (attemptId) => {
    const existing = await assessmentRepository.findAttemptById(attemptId);
    if (!existing) {
      throw new Error("Attempt not found");
    }

    return assessmentRepository.deleteAttempt(attemptId);
  },

  recalculateAttempt: async (attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    const questions = attempt.assessment.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionCode: normalizeSectionCode(section.code)
      }))
    );

    const scores = calculateScores(questions, attempt.answers);
    const hollandCode = calculateHollandCode(scores);
    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(scores, clusters);

    const top5 = rankedClusters.slice(0, 5);
    const top1 = top5[0] || null;

    const resultData = {
      hollandCode,
      topCareerCluster: top1?.name || null,
      topCareerMatch: top1 ? Math.round(top1.match * 100) : null,
      scores,
      top5Clusters: top5.map((c) => ({
        clusterId: c.clusterId,
        code: c.code,
        cluster: c.name,
        hollandCode: c.hollandCode,
        match: Math.round(c.match * 100),
        fitI: Math.round(c.fitI * 100),
        fitA: Math.round(c.fitA * 100),
        fitP: Math.round(c.fitP * 100),
        fitV: Math.round(c.fitV * 100)
      }))
    };

    const existingResult = await assessmentRepository.findResultByAttemptId(attemptId);
    if (existingResult) {
      await assessmentRepository.updateResult(attemptId, resultData);
    } else {
      await assessmentRepository.createResult({
        attemptId: Number(attemptId),
        ...resultData
      });
    }

    return assessmentRepository.findResultByAttemptId(attemptId);
  },


  // =========================================================
  // USER: TEST TAKING & RESULTS
  // =========================================================

  getPublishedAssessments: async () => {
    return assessmentRepository.findAllPublishedAssessments();
  },

  getAssessment: async (assessmentId) => {
    const assessment = await assessmentRepository.findPublishedAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Published assessment not found");
    }
    return assessment;
  },

  startAttempt: async (userId, assessmentId) => {
    if (!userId) {
      throw new Error("User ID is required to start assessment");
    }

    const assessment = await assessmentRepository.findPublishedAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error("Published assessment not found");
    }

    const attempt = await assessmentRepository.createAttempt({
      assessmentId: Number(assessmentId),
      userId: Number(userId),
      status: "in_progress"
    });

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      status: attempt.status,
      startedAt: attempt.startedAt
    };
  },

  getAttemptStatus: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not authorized to view this attempt");
    }

    const totalQuestions = attempt.assessment.sections.reduce(
      (count, s) => count + s.questions.length,
      0
    );
    const answeredQuestions = attempt.answers.length;

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      assessmentTitle: attempt.assessment.title,
      status: attempt.status,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      totalQuestions,
      answeredQuestions,
      progressPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      hasResult: Boolean(attempt.result)
    };
  },

  getAttemptQuestions: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to access this attempt");
    }

    // Map existing answers for convenience so frontend can prefill
    const answersMap = {};
    for (const a of attempt.answers) {
      answersMap[a.questionId] = {
        selectedOptionId: a.selectedOptionId,
        likertValue: a.likertValue
      };
    }

    const sectionsWithAnswers = attempt.assessment.sections.map((section) => ({
      ...section,
      questions: section.questions.map((q) => ({
        ...q,
        userAnswer: answersMap[q.id] || null
      }))
    }));

    return {
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      status: attempt.status,
      sections: sectionsWithAnswers
    };
  },

  getMyAttempts: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return assessmentRepository.findAttemptsByUserId(userId);
  },

  saveAnswer: async (userId, attemptId, body) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to answer this attempt");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is already completed or inactive");
    }

    const question = await assessmentRepository.findQuestionById(body.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.section.assessmentId !== attempt.assessmentId) {
      throw new Error("Question does not belong to this assessment");
    }

    // 1. Likert Question
    if (question.type === "likert5") {
      const value = Number(body.likertValue);
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error("Likert value must be an integer between 1 and 5");
      }

      return assessmentRepository.upsertAnswer({
        attemptId: Number(attemptId),
        questionId: question.id,
        likertValue: value,
        selectedOptionId: null
      });
    }

    // 2. MCQ Question
    if (!body.selectedOptionId) {
      throw new Error("selectedOptionId is required for MCQ questions");
    }

    const selectedOption = question.options.find(
      (opt) => Number(opt.id) === Number(body.selectedOptionId)
    );

    if (!selectedOption) {
      throw new Error("Invalid option selected for this question");
    }

    return assessmentRepository.upsertAnswer({
      attemptId: Number(attemptId),
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      likertValue: null
    });
  },

  saveBatchAnswers: async (userId, attemptId, answersArray) => {
    if (!Array.isArray(answersArray) || !answersArray.length) {
      throw new Error("Answers array is required");
    }

    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to answer this attempt");
    }

    if (attempt.status !== "in_progress") {
      throw new Error("Attempt is already completed or inactive");
    }

    const saved = [];
    for (const ans of answersArray) {
      if (!ans.questionId) continue;
      const question = await assessmentRepository.findQuestionById(ans.questionId);
      if (!question || question.section.assessmentId !== attempt.assessmentId) continue;

      if (question.type === "likert5" && ans.likertValue !== undefined && ans.likertValue !== null) {
        const value = Number(ans.likertValue);
        if (Number.isInteger(value) && value >= 1 && value <= 5) {
          const res = await assessmentRepository.upsertAnswer({
            attemptId: Number(attemptId),
            questionId: question.id,
            likertValue: value,
            selectedOptionId: null
          });
          saved.push(res);
        }
      } else if (ans.selectedOptionId) {
        const option = question.options.find((o) => Number(o.id) === Number(ans.selectedOptionId));
        if (option) {
          const res = await assessmentRepository.upsertAnswer({
            attemptId: Number(attemptId),
            questionId: question.id,
            selectedOptionId: option.id,
            likertValue: null
          });
          saved.push(res);
        }
      }
    }

    return {
      savedCount: saved.length,
      totalReceived: answersArray.length
    };
  },

  submitAttempt: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to submit this attempt");
    }

    // If already completed, return existing report
    if (attempt.status === "completed" && attempt.result) {
      return assessmentService.getResult(userId, attemptId);
    }

    // Attach section metadata onto question objects
    const questions = attempt.assessment.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        sectionCode: normalizeSectionCode(section.code),
        sectionTitle: section.title
      }))
    );

    // Verify all questions are answered
    const answeredQuestionIds = new Set(
      attempt.answers.map((a) => Number(a.questionId))
    );

    const unanswered = questions.filter(
      (q) => !answeredQuestionIds.has(Number(q.id))
    );

    if (unanswered.length > 0) {
      throw new Error(
        `Please answer all questions before submitting. Unanswered count: ${unanswered.length}`
      );
    }

    // 1. Calculate scores across all domains
    const scores = calculateScores(questions, attempt.answers);

    // 2. Calculate Holland code (RIASEC top 3)
    const hollandCode = calculateHollandCode(scores);

    // 3. Fetch Career Clusters and compute weighted matches
    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(scores, clusters);

    const top5 = rankedClusters.slice(0, 5);
    const top1 = top5[0] || null;

    const top5ClustersJson = top5.map((c) => ({
      clusterId: c.clusterId,
      code: c.code,
      cluster: c.name,
      hollandCode: c.hollandCode,
      match: Math.round(c.match * 100),
      fitI: Math.round(c.fitI * 100),
      fitA: Math.round(c.fitA * 100),
      fitP: Math.round(c.fitP * 100),
      fitV: Math.round(c.fitV * 100)
    }));

    // Save Assessment Result in DB
    const existingResult = await assessmentRepository.findResultByAttemptId(attemptId);
    let resultRecord;

    const resultPayload = {
      hollandCode,
      topCareerCluster: top1?.name || null,
      topCareerMatch: top1 ? Math.round(top1.match * 100) : null,
      scores,
      top5Clusters: top5ClustersJson
    };

    if (existingResult) {
      resultRecord = await assessmentRepository.updateResult(attemptId, resultPayload);
    } else {
      resultRecord = await assessmentRepository.createResult({
        attemptId: Number(attemptId),
        ...resultPayload
      });
    }

    // Mark attempt completed
    await assessmentRepository.completeAttempt(attemptId);

    // Build rich formatted report matching Career Compass report structure
    const fullReport = buildAssessmentReport({
      studentName: null,
      className: null,
      school: null,
      scores,
      hollandCode,
      rankedClusters,
      completedAt: new Date()
    });

    return {
      resultId: resultRecord.id,
      attemptId: Number(attemptId),
      hollandCode: resultRecord.hollandCode,
      topCareerCluster: resultRecord.topCareerCluster,
      topCareerMatch: resultRecord.topCareerMatch,
      scores: resultRecord.scores,
      top5Clusters: resultRecord.top5Clusters,
      report: fullReport
    };
  },

  getResult: async (userId, attemptId) => {
    const attempt = await assessmentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    if (Number(attempt.userId) !== Number(userId)) {
      throw new Error("You are not allowed to access this result");
    }

    const result = await assessmentRepository.findResultByAttemptId(attemptId);
    if (!result) {
      throw new Error("Result has not been generated for this attempt yet");
    }

    const clusters = await assessmentRepository.getCareerClusters();
    const rankedClusters = calculateClusterMatches(result.scores, clusters);

    const fullReport = buildAssessmentReport({
      studentName: null,
      className: null,
      school: null,
      scores: result.scores,
      hollandCode: result.hollandCode,
      rankedClusters,
      completedAt: attempt.completedAt || result.createdAt
    });

    return {
      resultId: result.id,
      attemptId: result.attemptId,
      assessmentId: attempt.assessmentId,
      assessmentTitle: attempt.assessment.title,
      status: attempt.status,
      completedAt: attempt.completedAt,
      hollandCode: result.hollandCode,
      topCareerCluster: result.topCareerCluster,
      topCareerMatch: result.topCareerMatch,
      scores: result.scores,
      top5Clusters: result.top5Clusters,
      report: fullReport
    };
  }

};