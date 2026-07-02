import { CounselingRepository } from "./CounselingForm.repository.js";

export const createCounseling = async (body) => {
  try {
    const result = await CounselingRepository.create({
      studentName: body.studentName,
      class: body.class,
      stream: body.stream,
      school: body.school,
      counselingDate: body.counselingDate
        ? new Date(body.counselingDate)
        : null,
      phoneNumber: body.phoneNumber,
      email: body.email,

      fatherOccupation: body.fatherOccupation,
      motherOccupation: body.motherOccupation,
      siblingCount: body.siblingCount,

      marks: body.marks,

      dreamCareerOption1: body.dreamCareerOption1,
      dreamCareerOption2: body.dreamCareerOption2,
      dreamCareerOption3: body.dreamCareerOption3,

      parentsExpectation: body.parentsExpectation,

      category: body.category,

      observation: body.observation,

      counselorName: body.counselorName,

      psychometricRecommended: body.psychometricRecommended,
    });

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getCounselings = async () => {
try {
const data = await CounselingRepository.findAll();

return {
  success: true,
  data,
};


} catch (err) {
return {
success: false,
message: err.message,
};
}
};

export const getCounselingById = async (id) => {
try {
const data = await CounselingRepository.findById(Number(id));

if (!data) {
  return {
    success: false,
    message: "Counseling form not found",
  };
}

return {
  success: true,
  data,
};


} catch (err) {
return {
success: false,
message: err.message,
};
}
};

export const updateCounseling = async (id, body) => {
  try {
    const result = await CounselingRepository.update(Number(id), {
      studentName: body.studentName,
      class: body.class,
      stream: body.stream,
      school: body.school,
      counselingDate: body.counselingDate
        ? new Date(body.counselingDate)
        : null,
      phoneNumber: body.phoneNumber,
      email: body.email,

      fatherOccupation: body.fatherOccupation,
      motherOccupation: body.motherOccupation,
      siblingCount: body.siblingCount,

      marks: body.marks,

      dreamCareerOption1: body.dreamCareerOption1,
      dreamCareerOption2: body.dreamCareerOption2,
      dreamCareerOption3: body.dreamCareerOption3,

      parentsExpectation: body.parentsExpectation,

      category: body.category,

      observation: body.observation,

      counselorName: body.counselorName,

      psychometricRecommended: body.psychometricRecommended,
    });

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
export const deleteCounseling = async (id) => {
try {
await CounselingRepository.delete(Number(id));


return {
  success: true,
  message: "Deleted successfully",
};


} catch (err) {
return {
success: false,
message: err.message,
};
}
};

export const generateCounselingReport = async (id) => {
  const counseling = await CounselingRepository.findById(Number(id));

  if (!counseling) {
    return {
      success: false,
      message: "Counseling record not found",
    };
  }

  return {
    success: true,
    data: counseling,
  };
};