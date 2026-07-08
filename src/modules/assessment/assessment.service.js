import { AssessmentRepository } from "./assessment.repository.js";

export const submitAssessment = async (userId, data) => {
  const {
    studentName,
    className,
    school,
    testVersion,
    answers,
    report,
    completedAt,
  } = data;

  if (!studentName || !className) {
    return {
      success: false,
      status: 400,
      message: "Student name and class are required.",
    };
  }

  if (!answers || !report) {
    return {
      success: false,
      status: 400,
      message: "Assessment data is missing.",
    };
  }
//   const existing =
//   await AssessmentRepository.getLatestAssessmentByUserId(userId);

// if (existing) {
//   return {
//     success: false,
//     status: 400,
//     message: "Assessment already completed.",
//   };
// }
  const assessment = await AssessmentRepository.createAssessment({
    userId,
    studentName,
    className,
    school,
    testVersion,
    answers,
    report,
    completedAt: completedAt ? new Date(completedAt) : new Date(),
  });

  return {
    success: true,
    status: 201,
    message: "Assessment submitted successfully.",
    data: assessment,
  };
};

export const getMyAssessment = async (userId) => {
  const assessment =
    await AssessmentRepository.getLatestAssessmentByUserId(userId);

  if (!assessment) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  return {
    success: true,
    status: 200,
    data: assessment,
  };
};

export const getAssessmentById = async (id) => {
  const assessment =
    await AssessmentRepository.getAssessmentById(Number(id));

  if (!assessment) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  return {
    success: true,
    status: 200,
    data: assessment,
  };
};

export const deleteAssessment = async (id) => {
  const assessment =
    await AssessmentRepository.getAssessmentById(Number(id));

  if (!assessment) {
    return {
      success: false,
      status: 404,
      message: "Assessment not found.",
    };
  }

  await AssessmentRepository.deleteAssessment(Number(id));

  return {
    success: true,
    status: 200,
    message: "Assessment deleted successfully.",
  };
};