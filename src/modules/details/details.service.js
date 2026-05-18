import { detailsRepository } from "./details.repository.js";

export const createDetails = async (body) => {
  try {
    const { salaryRanges, jobScope, ...rest } = body;

    const data = {
      ...rest,
      jobScope,
      salaryRanges: {
        create: salaryRanges || []
      }
    };

    const result = await detailsRepository.create(data);

    return { success: true, data: result };

  } catch (err) {
    console.error("Create Details Error:", err);
    return { success: false, message: err.message };
  }
};

export const getAllDetails = async () => {
  try {
    const data = await detailsRepository.findAll();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getDetailsById = async (id) => {
  try {
    const data = await detailsRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Details not found" };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateDetails = async (id, body) => {
  try {
    const { salaryRanges, jobScope, ...rest } = body;

    const data = {
      ...rest,
      jobScope,
      ...(salaryRanges && {
        salaryRanges: {
          deleteMany: {},      // 🔥 remove old
          create: salaryRanges // 🔥 insert new
        }
      })
    };

    const result = await detailsRepository.update(Number(id), data);

    return { success: true, data: result };

  } catch (err) {
    console.error("Update Details Error:", err);
    return { success: false, message: err.message };
  }
};

export const deleteDetails = async (id) => {
  try {
    await detailsRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};