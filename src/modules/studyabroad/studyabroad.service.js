import { StudyAbroadRepository } from "./studyabroad.repository.js";

// 🔹 CREATE
export const createStudyAbroad = async (body) => {
  try {
    const data = await StudyAbroadRepository.create({
      title: body.title,
      country_name: body.country_name,
      description: body.description,
      overview: body.overview,
      visa_work: body.visa_work,
      living_cost: body.living_cost,
      tution_cost: body.tution_cost,

      top_university: body.top_university || [],
      scholarship: body.scholarship || [],
      requirment: body.requirment || [],
      popular_course: body.popular_course || [],
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getStudyAbroad = async () => {
  try {
    const data = await StudyAbroadRepository.findAll();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getStudyAbroadById = async (id) => {
  try {
    const data = await StudyAbroadRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateStudyAbroad = async (id, body) => {
  try {
    const updated = await StudyAbroadRepository.update(Number(id), {
      title: body.title,
      country_name: body.country_name,
      description: body.description,
      overview: body.overview,
      visa_work: body.visa_work,
      living_cost: body.living_cost,
      tution_cost: body.tution_cost,

      top_university:
        body.top_university !== undefined
          ? body.top_university
          : undefined,

      scholarship:
        body.scholarship !== undefined
          ? body.scholarship
          : undefined,

      requirment:
        body.requirment !== undefined
          ? body.requirment
          : undefined,

      popular_course:
        body.popular_course !== undefined
          ? body.popular_course
          : undefined,
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteStudyAbroad = async (id) => {
  try {
    await StudyAbroadRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};