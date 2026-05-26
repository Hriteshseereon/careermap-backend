import { entranceExamRepository } from "./entranceexam.repository.js";

export const createExam = async (body) => {
  try {
    const data = await entranceExamRepository.create({
      moduleId: Number(body.moduleId),
      streamId: Number(body.streamId),
      categoryId: Number(body.categoryId),
      secondcategoryId: Number(body.secondcategoryId),
      subcategoryId: Number(body.subcategoryId),

      examname: body.examname,

      issuedate: body.issuedate ? new Date(body.issuedate) : null,
      lastdate: body.lastdate ? new Date(body.lastdate) : null,
      exam_date: body.exam_date ? new Date(body.exam_date) : null,

      url: body.url,
      about: body.about,
      eligibility: body.eligibility,
      mode: body.mode,
      duration: body.duration,
      total_mark: body.total_mark,
      frequncy: body.frequncy,
      exam_pattern: body.exam_pattern,

      subject: body.subject || [],
      top_institution: body.top_institution || [],
    });

    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getAllExam = async () => {
  try {
    const data = await entranceExamRepository.findAll();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getExamById = async (id) => {
  try {
    const data = await entranceExamRepository.findById(Number(id));
    return data
      ? { success: true, data }
      : { success: false, message: "Not found" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateExam = async (id, body) => {
  try {
    const updated = await entranceExamRepository.update(Number(id), {
      moduleId: body.moduleId ? Number(body.moduleId) : undefined,
      streamId: body.streamId ? Number(body.streamId) : undefined,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      secondcategoryId: body.secondcategoryId
        ? Number(body.secondcategoryId)
        : undefined,
      subcategoryId: body.subcategoryId
        ? Number(body.subcategoryId)
        : undefined,

      examname: body.examname,

      issuedate:
        body.issuedate !== undefined
          ? body.issuedate
            ? new Date(body.issuedate)
            : null
          : undefined,

      lastdate:
        body.lastdate !== undefined
          ? body.lastdate
            ? new Date(body.lastdate)
            : null
          : undefined,

      exam_date:
        body.exam_date !== undefined
          ? body.exam_date
            ? new Date(body.exam_date)
            : null
          : undefined,

      url: body.url,
      about: body.about,
      eligibility: body.eligibility,
      mode: body.mode,
      duration: body.duration,
      total_mark: body.total_mark,
      frequncy: body.frequncy,
      exam_pattern: body.exam_pattern,

      subject:
        body.subject !== undefined ? body.subject : undefined,

      top_institution:
        body.top_institution !== undefined
          ? body.top_institution
          : undefined,
    });

    return { success: true, data: updated };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const deleteExam = async (id) => {
  try {
    await entranceExamRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};