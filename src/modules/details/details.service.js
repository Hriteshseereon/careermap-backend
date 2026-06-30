import { detailsRepository } from "./details.repository.js";

export const createDetails = async (body) => {
  try {
    const {
      salaryRanges,
      jobScope,
       specialization,
  important_factor,
      careerpathIds,
      entranceexamIds,
      institutionIds,
      ...rest
    } = body;

    // Check duplicate
    const existing = await detailsRepository.findExisting({
      streamId: body.streamId,
      categoryId: body.categoryId,
      secondcategoryId: body.secondcategoryId,
      subcategoryId: body.subcategoryId,
    });

    if (existing) {
      return {
        success: false,
        message:
          "Details already exist for this stream/category/secondcategory/subcategory combination",
      };
    }

    const data = {
      ...rest,
      jobScope,
      specialization,

  important_factor,
      salaryRanges: {
        create: salaryRanges || [],
      },

      ...(careerpathIds && {
        careerpaths: {
          connect: careerpathIds.map((id) => ({ id })),
        },
      }),

      ...(entranceexamIds && {
        entranceexams: {
          connect: entranceexamIds.map((id) => ({ id })),
        },
      }),

      ...(institutionIds && {
        institutions: {
          connect: institutionIds.map((id) => ({ id })),
        },
      }),
    };

    const result = await detailsRepository.create(data);

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Create Details Error:", err);
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getAllDetails = async () => {
  try {
    const data = await detailsRepository.findAll();

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

export const getDetailsById = async (id) => {
  try {
    const data = await detailsRepository.findById(Number(id));

    if (!data) {
      return {
        success: false,
        message: "Details not found",
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

export const updateDetails = async (id, body) => {
  try {
    const {
      salaryRanges,
      jobScope,
           specialization,
  important_factor, 
      careerpathIds,
      entranceexamIds,
      institutionIds,
      ...rest
    } = body;

    // Check duplicate except current record
    const existing = await detailsRepository.findExisting({
      streamId: body.streamId,
      categoryId: body.categoryId,
      
      secondcategoryId: body.secondcategoryId,
      subcategoryId: body.subcategoryId,
    });

    if (existing && existing.id !== Number(id)) {
      return {
        success: false,
        message:
          "Details already exist for this stream/category/secondcategory/subcategory combination",
      };
    }

    const data = {
      ...rest,

      ...(jobScope !== undefined && {
        jobScope,
      }),

      ...(salaryRanges && {
        salaryRanges,
      }),

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

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Update Details Error:", err);

    return {
      success: false,
      message: err.message,
    };
  }
};

export const deleteDetails = async (id) => {
  try {
    await detailsRepository.delete(Number(id));

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