import { uploadToS3 } from "../../lib/s3Upload.js";
import { InstitutionRepository } from "./institution.repository.js";

// 🔹 Create
export const createInstitution = async (body, file) => {
  try {
    const imageUrl = file
      ? await uploadToS3(file, "institutions")
      : null;

    // 🔥 FIX ARRAY PARSING
    let course_offered = [];
    if (body.course_offered) {
      try {
        course_offered = JSON.parse(body.course_offered);
      } catch {
        course_offered = [body.course_offered];
      }
    }

    const institution = await InstitutionRepository.createInstitution({
       categoryId: body.categoryId
        ? Number(body.categoryId)
        : null,

      secondcategoryId:
        body.secondcategoryId
          ? Number(body.secondcategoryId)
          : null,

      subcategoryId:
        body.subcategoryId
          ? Number(body.subcategoryId)
          : null,
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

      about: body.about,
      course_offered, // ✅ parsed array

      is_top: body.is_top === "true" || body.is_top === true,
    });

    return { success: true, data: institution };
  } catch (error) {
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
    console.log("========== UPDATE INSTITUTION START ==========");
    console.log("Institution ID:", id);

    console.log("RAW BODY:");
    console.log(body);

    console.log("CATEGORY VALUES:");
    console.log("categoryId:", body.categoryId);
    console.log("secondcategoryId:", body.secondcategoryId);
    console.log("subcategoryId:", body.subcategoryId);

    let logoUrl;

    if (file) {
      console.log("Uploading new logo...");
      logoUrl = await uploadToS3(file, "institutions");
      console.log("Logo uploaded:", logoUrl);
    }

    let course_offered;

    if (body.course_offered !== undefined) {
      console.log(
        "Raw course_offered:",
        body.course_offered
      );

      try {
        course_offered = JSON.parse(body.course_offered);

        console.log(
          "Parsed course_offered:",
          course_offered
        );
      } catch (error) {
        console.log(
          "course_offered JSON parse failed:",
          error.message
        );

        course_offered = [body.course_offered];
      }
    }

    const updateData = {
      categoryId:
        body.categoryId !== undefined
          ? Number(body.categoryId)
          : null,

      secondcategoryId:
        body.secondcategoryId !== undefined
          ? Number(body.secondcategoryId)
          : null,

      subcategoryId:
        body.subcategoryId
          ? Number(body.subcategoryId)
          : null,

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
      about: body.about,

      ...(course_offered !== undefined && {
        course_offered,
      }),

      is_top:
        body.is_top !== undefined
          ? body.is_top === "true" ||
            body.is_top === true
          : undefined,

      ...(logoUrl && {
        logo: logoUrl,
      }),
    };

    console.log("========== DATA SENT TO PRISMA ==========");
    console.log(updateData);

    console.log(
      "categoryId type:",
      typeof updateData.categoryId
    );

    console.log(
      "secondcategoryId type:",
      typeof updateData.secondcategoryId
    );

    console.log(
      "subcategoryId:",
      updateData.subcategoryId
    );

    console.log("Calling InstitutionRepository.update...");

    const updated =
      await InstitutionRepository.update(
        Number(id),
        updateData
      );

    console.log(
      "========== UPDATE SUCCESS =========="
    );

    console.log("Updated institution:", updated);

    return {
      success: true,
      data: updated,
    };

  } catch (error) {

    console.error(
      "========== UPDATE INSTITUTION ERROR =========="
    );

    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);
    console.error("Full error:", error);

    return {
      success: false,
      message: error.message,
    };
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