import { CounselingRepository } from "./CounselingForm.repository.js";

export const createCounseling = async (body) => {
try {
const result = await CounselingRepository.create({
firstName: body.firstName,
lastName: body.lastName,
email: body.email,
inquiryFor: body.inquiryFor,
interest: body.interest,
study: body.study,
description: body.description,
});


return {
  success: true,
  data: result,
};

} catch (err) {
console.error("Create Counseling Error:", err);

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
const result = await CounselingRepository.update(
Number(id),
body
);

return {
  success: true,
  data: result,
};


} catch (err) {
console.error("Update Counseling Error:", err);


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
