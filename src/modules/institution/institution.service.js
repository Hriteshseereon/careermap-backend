import { uploadToS3 } from "../../lib/s3Upload.js";
import { InstitutionRepository } from "./institution.repository.js";

// 🔹 Create
export const createInstitution = async (body, file) => {
  try {
    const imageUrl = await uploadToS3(file, "institutions");   
    
    const institution = await InstitutionRepository.createInstitution({
  name: body.name,
  logo: imageUrl,
  address: body.address,
  admission_process: body.admission_process,
  tentative_date: body.tentative_date,
  institute_type: body.institute_type,
  url: body.url,
  countruy: body.countruy,
  state: body.state,
  city: body.city,
  district: body.district,
  is_top: body.is_top === "true" || body.is_top === true,
});

    return { success: true, data: institution };
    } catch (error) {
    console.error("❌ createInstitution Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 Get All
export const getInstitutions = async () => {
  try {
    const data = await InstitutionRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getInstitutions Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 Update
export const updateInstitution = async (id, body, file) => {
  try {
    let logoUrl;

    if (file) {
      logoUrl = await uploadToS3(file, "institutions");
    }

    const updated = await InstitutionRepository.update(Number(id), {
      name: body.name,
      address: body.address,
      admission_process: body.admission_process,
      tentative_date: body.tentative_date,
      institute_type: body.institute_type,
      url: body.url,
      countruy: body.countruy,
      state: body.state,
      city: body.city,
      district: body.district,
      is_top:
        body.is_top !== undefined
          ? body.is_top === "true" || body.is_top === true
          : undefined,

      ...(logoUrl && { logo: logoUrl }), // ✅ correct field
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("❌ updateInstitution Error:", error);
    return { success: false, message: error.message };
  }
};

export const getInstitutionById = async (id) => {
  try {
    const institution = await InstitutionRepository.findById(Number(id));

    if (!institution) {
      return { success: false, message: "Institution not found" };
    }

    return { success: true, data: institution };

  } catch (error) {
    console.error("❌ getInstitutionById Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 Delete
export const deleteInstitution = async (id) => {
  try {
    await InstitutionRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deleteInstitution Error:", error);
    return { success: false, message: error.message };
  }
};