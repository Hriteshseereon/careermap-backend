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

  findAllAssessments: ({ status, search, skip = 0, take = 50 } = {}) => {
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    return prisma.assessment.findMany({
      where,
      skip: Number(skip),
      take: Number(take),
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: {
            sections: true,
            attempts: true
          }
        },
        sections: {
          orderBy: {
            order: "asc"
          },
          include: {
            _count: {
              select: {
                questions: true
              }
            }
          }
        }
      }
    });
  },

  countAssessments: ({ status, search } = {}) => {
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    return prisma.assessment.count({ where });
  },

  findAssessmentById: (id) => {
    return prisma.assessment.findUnique({
      where: {
        id: Number(id)
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
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    });
  },

  findAssessmentBySlug: (slug) => {
    return prisma.assessment.findUnique({
      where: {
        slug
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
                  }
                }
              }
            }
          }
        }
      }
    });
  },

  findAllPublishedAssessments: () => {
    return prisma.assessment.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        sections: {
          orderBy: {
            order: "asc"
          },
          select: {
            id: true,
            code: true,
            title: true,
            description: true,
            order: true,
            _count: {
              select: {
                questions: true
              }
            }
          }
        }
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

  updateAssessment: (id, data) => {
    return prisma.assessment.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteAssessment: (id) => {
    return prisma.assessment.delete({
      where: {
        id: Number(id)
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

  findSectionsByAssessmentId: (assessmentId) => {
    return prisma.assessmentSection.findMany({
      where: {
        assessmentId: Number(assessmentId)
      },
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
    });
  },

  findSectionById: (id) => {
    return prisma.assessmentSection.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        assessment: true,
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
    });
  },

  findSectionByCode: (assessmentId, code) => {
    return prisma.assessmentSection.findUnique({
      where: {
        assessmentId_code: {
          assessmentId: Number(assessmentId),
          code
        }
      }
    });
  },

  updateSection: (id, data) => {
    return prisma.assessmentSection.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteSection: (id) => {
    return prisma.assessmentSection.delete({
      where: {
        id: Number(id)
      }
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

  findQuestionsBySectionId: (sectionId) => {
    return prisma.assessmentQuestion.findMany({
      where: {
        sectionId: Number(sectionId)
      },
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
    });
  },

  findQuestionsByAssessmentId: (assessmentId) => {
    return prisma.assessmentQuestion.findMany({
      where: {
        section: {
          assessmentId: Number(assessmentId)
        }
      },
      orderBy: [
        { section: { order: "asc" } },
        { order: "asc" }
      ],
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

  findQuestionByItemId: (sectionId, itemId) => {
    return prisma.assessmentQuestion.findUnique({
      where: {
        sectionId_itemId: {
          sectionId: Number(sectionId),
          itemId
        }
      },
      include: {
        options: {
          orderBy: {
            optionIndex: "asc"
          }
        }
      }
    });
  },

  updateQuestion: (id, data) => {
    return prisma.assessmentQuestion.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteQuestion: (id) => {
    return prisma.assessmentQuestion.delete({
      where: {
        id: Number(id)
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
        optionIndex: typeof option.optionIndex === "number" ? option.optionIndex : index,
        isCorrect: Boolean(option.isCorrect),
        image: option.image || null
      }))
    });
  },

  findOptionsByQuestionId: (questionId) => {
    return prisma.assessmentOption.findMany({
      where: {
        questionId: Number(questionId)
      },
      orderBy: {
        optionIndex: "asc"
      }
    });
  },

  findOptionById: (id) => {
    return prisma.assessmentOption.findUnique({
      where: {
        id: Number(id)
      }
    });
  },

  updateOption: (id, data) => {
    return prisma.assessmentOption.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteOption: (id) => {
    return prisma.assessmentOption.delete({
      where: {
        id: Number(id)
      }
    });
  },

  deleteOptionsByQuestionId: (questionId) => {
    return prisma.assessmentOption.deleteMany({
      where: {
        questionId: Number(questionId)
      }
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

  findAllAttempts: ({ assessmentId, userId, status, skip = 0, take = 50 } = {}) => {
    const where = {};

    if (assessmentId) {
      where.assessmentId = Number(assessmentId);
    }

    if (userId) {
      where.userId = Number(userId);
    }

    if (status) {
      where.status = status;
    }

    return prisma.assessmentAttempt.findMany({
      where,
      skip: Number(skip),
      take: Number(take),
      orderBy: {
        createdAt: "desc"
      },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            slug: true,
            version: true
          }
        },
        result: true,
        _count: {
          select: {
            answers: true
          }
        }
      }
    });
  },

  countAttempts: ({ assessmentId, userId, status } = {}) => {
    const where = {};

    if (assessmentId) {
      where.assessmentId = Number(assessmentId);
    }

    if (userId) {
      where.userId = Number(userId);
    }

    if (status) {
      where.status = status;
    }

    return prisma.assessmentAttempt.count({ where });
  },

  findAttemptsByUserId: (userId) => {
    return prisma.assessmentAttempt.findMany({
      where: {
        userId: Number(userId)
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            slug: true,
            version: true
          }
        },
        result: true,
        _count: {
          select: {
            answers: true
          }
        }
      }
    });
  },

  deleteAttempt: (attemptId) => {
    return prisma.assessmentAttempt.delete({
      where: {
        id: Number(attemptId)
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
        selectedOptionId: data.selectedOptionId ? Number(data.selectedOptionId) : null,
        likertValue: data.likertValue !== null && data.likertValue !== undefined ? Number(data.likertValue) : null,
        answeredAt: new Date()
      },
      create: {
        attemptId: Number(data.attemptId),
        questionId: Number(data.questionId),
        selectedOptionId: data.selectedOptionId ? Number(data.selectedOptionId) : null,
        likertValue: data.likertValue !== null && data.likertValue !== undefined ? Number(data.likertValue) : null,
        answeredAt: new Date()
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

  updateResult: (attemptId, data) => {
    return prisma.assessmentResult.update({
      where: {
        attemptId: Number(attemptId)
      },
      data
    });
  },

  findResultByAttemptId: (attemptId) => {
    return prisma.assessmentResult.findUnique({
      where: {
        attemptId: Number(attemptId)
      },
      include: {
        attempt: {
          include: {
            assessment: true
          }
        }
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

  getCareerClusters: () => {
    return prisma.careerCluster.findMany({
      orderBy: {
        name: "asc"
      },
      include: {
        weights: {
          orderBy: {
            facet: "asc"
          }
        }
      }
    });
  },

  findCareerClusterById: (id) => {
    return prisma.careerCluster.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        weights: {
          orderBy: {
            facet: "asc"
          }
        }
      }
    });
  },

  findCareerClusterByCode: (code) => {
    return prisma.careerCluster.findUnique({
      where: {
        code
      },
      include: {
        weights: true
      }
    });
  },

  updateCareerCluster: (id, data) => {
    return prisma.careerCluster.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteCareerCluster: (id) => {
    return prisma.careerCluster.delete({
      where: {
        id: Number(id)
      }
    });
  },

  // =========================================================
  // CAREER CLUSTER WEIGHTS
  // =========================================================

  createCareerClusterWeight: (data) => {
    return prisma.careerClusterWeight.create({
      data
    });
  },

  upsertCareerClusterWeight: (clusterId, facet, weight) => {
    return prisma.careerClusterWeight.upsert({
      where: {
        clusterId_facet: {
          clusterId: Number(clusterId),
          facet
        }
      },
      update: {
        weight: Number(weight)
      },
      create: {
        clusterId: Number(clusterId),
        facet,
        weight: Number(weight)
      }
    });
  },

  findWeightsByClusterId: (clusterId) => {
    return prisma.careerClusterWeight.findMany({
      where: {
        clusterId: Number(clusterId)
      },
      orderBy: {
        facet: "asc"
      }
    });
  },

  findWeightById: (id) => {
    return prisma.careerClusterWeight.findUnique({
      where: {
        id: Number(id)
      }
    });
  },

  updateCareerClusterWeight: (id, data) => {
    return prisma.careerClusterWeight.update({
      where: {
        id: Number(id)
      },
      data
    });
  },

  deleteCareerClusterWeight: (id) => {
    return prisma.careerClusterWeight.delete({
      where: {
        id: Number(id)
      }
    });
  },

  deleteWeightsByClusterId: (clusterId) => {
    return prisma.careerClusterWeight.deleteMany({
      where: {
        clusterId: Number(clusterId)
      }
    });
  }

};