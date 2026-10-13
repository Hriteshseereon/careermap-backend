import prisma from "../../config/db.js";
import { CounselingRepository } from "./CounselingForm.repository.js";

/**
 * Helper to resolve whether request is from Admin or Staff (Counselor)
 */
const resolveUser = async (userContext = {}) => {
  if (userContext?.admin) {
    return { isAdmin: true };
  }

  if (userContext?.staff) {
    const staffId = Number(userContext.staff.id);
    const staffUser = await prisma.staffUser.findUnique({
      where: { id: staffId },
      include: { role: true },
    });

    const roleName = (staffUser?.role?.name || userContext.staff.roleName || "").toLowerCase();
    const isAdminRole = roleName.includes("admin") || roleName.includes("super");

    return {
      isAdmin: isAdminRole,
      staff: staffUser,
      staffId: staffUser?.id || staffId,
      name: (staffUser?.name || userContext.staff.name || "").trim(),
      email: (staffUser?.email || userContext.staff.email || "").trim(),
      roleName: staffUser?.role?.name || userContext.staff.roleName || "Staff",
    };
  }

  // Fallback if neither is present (e.g., internal call)
  return { isAdmin: true };
};

/**
 * Permission checker:
 * - Admin can access all records
 * - Counselor/Staff can only access records they created (by name, email, or _createdById metadata)
 */
const canAccessCounseling = (record, resolvedUser) => {
  if (resolvedUser.isAdmin) return true;
  if (!record) return false;

  const staffName = (resolvedUser.name || "").toLowerCase();
  const staffEmail = (resolvedUser.email || "").toLowerCase();
  const staffId = resolvedUser.staffId;

  // 1. Check counselorName field in record
  if (record.counselorName) {
    const recName = record.counselorName.trim().toLowerCase();
    if (staffName && recName === staffName) return true;
    if (staffEmail && recName === staffEmail) return true;
    if (staffName && (recName.includes(staffName) || staffName.includes(recName))) return true;
  }

  // 2. Check metadata in marks JSON
  if (record.marks && typeof record.marks === "object") {
    const createdById = record.marks._createdById || record.marks._staffId;
    if (createdById && staffId && Number(createdById) === Number(staffId)) {
      return true;
    }
    const metaCounselorName = (record.marks._counselorName || "").toString().trim().toLowerCase();
    if (metaCounselorName && staffName && metaCounselorName === staffName) {
      return true;
    }
  }

  return false;
};

/**
 * Format counseling record for clean frontend consumption:
 * - Moves _createdById, _creatorType, etc. to creatorMetadata
 * - Leaves marks containing strictly academic subject scores
 */
export const formatCounselingResponse = (record) => {
  if (!record) return record;
  const rec = { ...record };

  if (rec.marks && typeof rec.marks === "object") {
    const cleanMarks = {};
    const meta = {};

    const source = (rec.marks.rawMarks && typeof rec.marks.rawMarks === "object")
      ? { ...rec.marks, ...rec.marks.rawMarks }
      : rec.marks;

    for (const [key, val] of Object.entries(source)) {
      if (key.startsWith("_")) {
        meta[key.slice(1)] = val;
      } else if (key !== "rawMarks") {
        cleanMarks[key] = val;
      }
    }

    rec.marks = cleanMarks;
    rec.creatorMetadata = {
      createdById: meta.createdById || null,
      counselorName: meta.counselorName || rec.counselorName || null,
      creatorType: meta.creatorType || null,
      createdAt: meta.createdAt || rec.createdAt,
    };
  }

  return rec;
};

export const createCounseling = async (body, userContext) => {
  try {
    const user = await resolveUser(userContext);

    let counselorName = (body.counselorName || "").trim();
    if (!counselorName) {
      counselorName = user.isAdmin ? "Admin" : (user.name || "Counselor");
    }

    // Embed creator metadata in marks JSON for foolproof tracking
    let marksData = body.marks;
    const meta = {
      _createdById: user.staffId || null,
      _counselorName: counselorName,
      _creatorType: user.isAdmin ? "admin" : "staff",
      _createdAt: new Date().toISOString(),
    };

    if (typeof marksData === "object" && marksData !== null && !Array.isArray(marksData)) {
      marksData = { ...marksData, ...meta };
    } else if (marksData !== undefined && marksData !== null) {
      marksData = { rawMarks: marksData, ...meta };
    } else {
      marksData = meta;
    }

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
      siblingCount: body.siblingCount !== undefined && body.siblingCount !== null ? Number(body.siblingCount) : null,

      marks: marksData,

      dreamCareerOption1: body.dreamCareerOption1,
      dreamCareerOption2: body.dreamCareerOption2,
      dreamCareerOption3: body.dreamCareerOption3,

      parentsExpectation: body.parentsExpectation,

      category: body.category,

      observation: body.observation,

      counselorName,

      psychometricRecommended: body.psychometricRecommended,
    });

    return {
      success: true,
      data: formatCounselingResponse(result),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getCounselings = async (userContext) => {
  try {
    const user = await resolveUser(userContext);

    const allRecords = await CounselingRepository.findAll();

    if (user.isAdmin) {
      return {
        success: true,
        total: allRecords.length,
        data: allRecords.map(formatCounselingResponse),
      };
    }

    // Staff/Counselor only sees their own created records
    const filtered = allRecords.filter((rec) => canAccessCounseling(rec, user));

    return {
      success: true,
      total: filtered.length,
      data: filtered.map(formatCounselingResponse),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getCounselingById = async (id, userContext) => {
  try {
    const user = await resolveUser(userContext);
    const data = await CounselingRepository.findById(Number(id));

    if (!data) {
      return {
        success: false,
        statusCode: 404,
        message: "Counseling form not found",
      };
    }

    if (!canAccessCounseling(data, user)) {
      return {
        success: false,
        statusCode: 403,
        message: "Unauthorized: You can only view counseling reports created by you",
      };
    }

    return {
      success: true,
      data: formatCounselingResponse(data),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const updateCounseling = async (id, body, userContext) => {
  try {
    const user = await resolveUser(userContext);
    const existing = await CounselingRepository.findById(Number(id));

    if (!existing) {
      return {
        success: false,
        statusCode: 404,
        message: "Counseling form not found",
      };
    }

    if (!canAccessCounseling(existing, user)) {
      return {
        success: false,
        statusCode: 403,
        message: "Unauthorized: You can only update counseling reports created by you",
      };
    }

    // Preserve creator metadata in marks if updating
    let marksData = body.marks !== undefined ? body.marks : existing.marks;
    if (typeof marksData === "object" && marksData !== null && !Array.isArray(marksData)) {
      const existingMeta =
        existing.marks && typeof existing.marks === "object"
          ? {
              _createdById: existing.marks._createdById,
              _counselorName: existing.marks._counselorName,
              _creatorType: existing.marks._creatorType,
            }
          : {};
      marksData = { ...marksData, ...existingMeta };
    }

    const counselorName =
      body.counselorName !== undefined
        ? body.counselorName
        : existing.counselorName;

    const result = await CounselingRepository.update(Number(id), {
      studentName: body.studentName !== undefined ? body.studentName : existing.studentName,
      class: body.class !== undefined ? body.class : existing.class,
      stream: body.stream !== undefined ? body.stream : existing.stream,
      school: body.school !== undefined ? body.school : existing.school,
      counselingDate: body.counselingDate !== undefined
        ? (body.counselingDate ? new Date(body.counselingDate) : null)
        : existing.counselingDate,
      phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : existing.phoneNumber,
      email: body.email !== undefined ? body.email : existing.email,

      fatherOccupation: body.fatherOccupation !== undefined ? body.fatherOccupation : existing.fatherOccupation,
      motherOccupation: body.motherOccupation !== undefined ? body.motherOccupation : existing.motherOccupation,
      siblingCount: body.siblingCount !== undefined
        ? (body.siblingCount !== null ? Number(body.siblingCount) : null)
        : existing.siblingCount,

      marks: marksData,

      dreamCareerOption1: body.dreamCareerOption1 !== undefined ? body.dreamCareerOption1 : existing.dreamCareerOption1,
      dreamCareerOption2: body.dreamCareerOption2 !== undefined ? body.dreamCareerOption2 : existing.dreamCareerOption2,
      dreamCareerOption3: body.dreamCareerOption3 !== undefined ? body.dreamCareerOption3 : existing.dreamCareerOption3,

      parentsExpectation: body.parentsExpectation !== undefined ? body.parentsExpectation : existing.parentsExpectation,

      category: body.category !== undefined ? body.category : existing.category,

      observation: body.observation !== undefined ? body.observation : existing.observation,

      counselorName,

      psychometricRecommended:
        body.psychometricRecommended !== undefined
          ? body.psychometricRecommended
          : existing.psychometricRecommended,
    });

    return {
      success: true,
      data: formatCounselingResponse(result),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const deleteCounseling = async (id, userContext) => {
  try {
    const user = await resolveUser(userContext);
    const existing = await CounselingRepository.findById(Number(id));

    if (!existing) {
      return {
        success: false,
        statusCode: 404,
        message: "Counseling form not found",
      };
    }

    if (!canAccessCounseling(existing, user)) {
      return {
        success: false,
        statusCode: 403,
        message: "Unauthorized: You can only delete counseling reports created by you",
      };
    }

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

export const generateCounselingReport = async (id, userContext) => {
  const user = await resolveUser(userContext);
  const counseling = await CounselingRepository.findById(Number(id));

  if (!counseling) {
    return {
      success: false,
      statusCode: 404,
      message: "Counseling record not found",
    };
  }

  if (!canAccessCounseling(counseling, user)) {
    return {
      success: false,
      statusCode: 403,
      message: "Unauthorized: You can only download reports created by you",
    };
  }

  return {
    success: true,
    data: formatCounselingResponse(counseling),
  };
};

export const getCounselingsByCounselor = async (counselorName, userContext) => {
  try {
    const user = await resolveUser(userContext);

    // If staff/counselor, they can only view their own counselorName
    if (!user.isAdmin) {
      const staffName = (user.name || "").toLowerCase();
      const requestedName = (counselorName || "").toLowerCase();
      if (staffName !== requestedName) {
        return {
          success: false,
          statusCode: 403,
          message: "Unauthorized: You cannot view reports for another counselor",
        };
      }
    }

    const allRecords = await CounselingRepository.findAll();
    const filtered = allRecords.filter((rec) => {
      const recName = (rec.counselorName || "").trim().toLowerCase();
      return recName === (counselorName || "").trim().toLowerCase();
    });

    return {
      success: true,
      total: filtered.length,
      data: filtered.map(formatCounselingResponse),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};