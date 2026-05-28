import { detailsRepository } from "./details.repository.js";

export const createDetails = async (body) => {
  try {
    const { salaryRanges, jobScope, careerpathIds, entranceexamIds, institutionIds, ...rest } = body;

    const data = {
      ...rest,
      jobScope,

      salaryRanges: {
        create: salaryRanges || []
      },

      ...(careerpathIds && {
        careerpaths: {
          connect: careerpathIds.map(id => ({ id }))
        }
      }),

      ...(entranceexamIds && {
        entranceexams: {
          connect: entranceexamIds.map(id => ({ id }))
        }
      }),

      ...(institutionIds && {
        institutions: {
          connect: institutionIds.map(id => ({ id }))
        }
      })
    };

    const result = await detailsRepository.create(data);

    return { success: true, data: result };

  } catch (err) {
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
    const {
      salaryRanges,
      jobScope,
      careerpathIds,
      entranceexamIds,
      institutionIds,
      ...rest
    } = body;

    const data = {
      ...rest,

      // ✅ Update jobScope only if provided
      ...(jobScope !== undefined && { jobScope }),

      // ✅ Replace salary ranges
     ...(salaryRanges && {
  salaryRanges,
}),

      // ✅ MANY-TO-MANY updates
      ...(careerpathIds && {
        careerpaths: {
          set: careerpathIds.map((id) => ({ id })),
        },
      }),

      ...(entranceexamIds && {
        entranceexams: {
          set: entranceexamIds.map((id) => ({ id })),
        },
      }),

      ...(institutionIds && {
        institutions: {
          set: institutionIds.map((id) => ({ id })),
        },
      }),
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