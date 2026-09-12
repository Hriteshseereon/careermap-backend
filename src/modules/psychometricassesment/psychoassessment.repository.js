import prisma from "../../config/db.js";

export const assessmentRepository = {

  // =========================================================
  // ASSESSMENT
  // =========================================================

  createAssessment: (data) => {
    return prisma.assessment.create({
      data
    });
  },

  findAssessmentById: (id) => {
    return prisma.assessment.findUnique({
      where: {
        id: Number(id)
      }
    });
  },

  findPublishedAssessmentById: (id) => {
    return prisma.assessment.findFirst({
      where: {
        id: Number(id),
        status: "published"
      },
      include: {
        sections: {
          orderBy: {
            order: "asc"
          },
          include: {
            questions: {
              orderBy: {
                order: "asc"
              },
              include: {
                options: {
                  orderBy: {
                    optionIndex: "asc"
                  },
                  select: {
                    id: true,
                    optionText: true,
                    optionIndex: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      }
    });
  },

  // =========================================================
  // SECTION
  // =========================================================

  createSection: (data) => {
    return prisma.assessmentSection.create({
      data
    });
  },

  // =========================================================
  // QUESTION
  // =========================================================

  createQuestion: (data) => {
    return prisma.assessmentQuestion.create({
      data
    });
  },

  findQuestionById: (id) => {
    return prisma.assessmentQuestion.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        section: true,
        options: {
          orderBy: {
            optionIndex: "asc"
          }
        }
      }
    });
  },

  // =========================================================
  // OPTIONS
  // =========================================================

  createOptions: (questionId, options) => {

    return prisma.assessmentOption.createMany({
      data: options.map((option, index) => ({
        questionId: Number(questionId),
        optionText: option.optionText,
        optionIndex: index,
        isCorrect: Boolean(option.isCorrect),
        image: option.image || null
      }))
    });

  },

  // =========================================================
  // ATTEMPT
  // =========================================================

  createAttempt: (data) => {
    return prisma.assessmentAttempt.create({
      data
    });
  },

  findAttemptById: (attemptId) => {
    return prisma.assessmentAttempt.findUnique({
      where: {
        id: Number(attemptId)
      },
      include: {
        assessment: {
          include: {
            sections: {
              orderBy: {
                order: "asc"
              },
              include: {
                questions: {
                  orderBy: {
                    order: "asc"
                  },
                  include: {
                    options: {
                      orderBy: {
                        optionIndex: "asc"
                      }
                    }
                  }
                }
              }
            }
          }
        },

        answers: {
          include: {
            question: {
              include: {
                section: true,
                options: true
              }
            },
            selectedOption: true
          }
        },

        result: true
      }
    });
  },

  // =========================================================
  // ANSWER
  // =========================================================

  upsertAnswer: (data) => {

    return prisma.assessmentAnswer.upsert({

      where: {
        attemptId_questionId: {
          attemptId: Number(data.attemptId),
          questionId: Number(data.questionId)
        }
      },

      update: {
        selectedOptionId:
          data.selectedOptionId ?? null,

        likertValue:
          data.likertValue ?? null,

        answeredAt: new Date()
      },

      create: {
        attemptId: Number(data.attemptId),
        questionId: Number(data.questionId),

        selectedOptionId:
          data.selectedOptionId ?? null,

        likertValue:
          data.likertValue ?? null
      }

    });

  },

  // =========================================================
  // COMPLETE ATTEMPT
  // =========================================================

  completeAttempt: (attemptId) => {

    return prisma.assessmentAttempt.update({
      where: {
        id: Number(attemptId)
      },

      data: {
        status: "completed",
        completedAt: new Date()
      }
    });

  },

  // =========================================================
  // RESULT
  // =========================================================

  createResult: (data) => {

    return prisma.assessmentResult.create({
      data
    });

  },

  findResultByAttemptId: (attemptId) => {

    return prisma.assessmentResult.findUnique({
      where: {
        attemptId: Number(attemptId)
      }
    });

  },

  // =========================================================
  // CAREER CLUSTERS
  // =========================================================

  createCareerCluster: (data) => {

    return prisma.careerCluster.create({
      data
    });

  },

  createCareerClusterWeight: (data) => {

    return prisma.careerClusterWeight.create({
      data
    });

  },

  getCareerClusters: () => {

    return prisma.careerCluster.findMany({
      include: {
        weights: true
      }
    });

  }

};