import { MasterClassRepository } from "./masterclass.repository.js";

// 🔹 CREATE
export const createMasterClass = async (body) => {
  try {
    const data = await MasterClassRepository.create({
      category: body.category,
      image: body.image,
      title: body.title,
      name: body.name,
      time: body.time ? new Date(body.time) : null,
      views: body.views,
      is_active:
        body.is_active === "true" || body.is_active === true,
      video_url: body.video_url,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getMasterClasses = async () => {
  try {
    const data = await MasterClassRepository.findAll();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getMasterClassById = async (id) => {
  try {
    const data = await MasterClassRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "MasterClass not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateMasterClass = async (id, body) => {
  try {
    const updated = await MasterClassRepository.update(Number(id), {
      category: body.category,
      image: body.image,
      title: body.title,
      name: body.name,
      time:
        body.time !== undefined
          ? body.time
            ? new Date(body.time)
            : null
          : undefined,
      views: body.views,
      is_active:
        body.is_active !== undefined
          ? body.is_active === "true" || body.is_active === true
          : undefined,
      video_url: body.video_url,
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteMasterClass = async (id) => {
  try {
    await MasterClassRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};