import { uploadToS3 } from "../../lib/s3Upload.js";
import { ScholarshipRepository } from "./scholarship.repository.js";

// 🔹 CREATE
export const createScholarship = async (body, file) => {
  try {
    // ✅ unique name check
    const existing = await ScholarshipRepository.findByName(body.name);

    if (existing) {
      return {
        success: false,
        message: "Scholarship with this name already exists",
      };
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadToS3(file, "scholarships");
    }

    const data = await ScholarshipRepository.create({
      name: body.name,
      type: body.type,
      url: body.url,
      is_free:
        body.is_free !== undefined
          ? body.is_free === "true" || body.is_free === true
          : undefined,
      price: body.price,
      deadline: body.deadline ? new Date(body.deadline) : null,
      eligibility: body.eligibility,
      requirement: body.requirement,
      description: body.description,

      ...(imageUrl && { image: imageUrl }),
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ createScholarship Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getScholarships = async () => {
  try {
    const data = await ScholarshipRepository.findAll();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getScholarshipById = async (id) => {
  try {
    const data = await ScholarshipRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateScholarship = async (id, body, file) => {
  try {
    let imageUrl;

    if (file) {
      imageUrl = await uploadToS3(file, "scholarships");
    }

    const updated = await ScholarshipRepository.update(Number(id), {
      name: body.name,
      type: body.type,
      url: body.url,
      is_free:
        body.is_free !== undefined
          ? body.is_free === "true" || body.is_free === true
          : undefined,
      price: body.price,
      deadline: body.deadline ? new Date(body.deadline) : null,
      eligibility: body.eligibility,
      requirement: body.requirement,
      description: body.description,

      ...(imageUrl && { image: imageUrl }),
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteScholarship = async (id) => {
  try {
    await ScholarshipRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};