import {
  createStudyAbroad,
  getStudyAbroad,
  getStudyAbroadById,
  updateStudyAbroad,
  deleteStudyAbroad,
} from "./studyabroad.service.js";

// CREATE
export const createStudyAbroadController = async (req, res) => {
  const result = await createStudyAbroad(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getStudyAbroadController = async (req, res) => {
  const result = await getStudyAbroad();
  res.status(200).json(result);
};

// GET BY ID
export const getStudyAbroadByIdController = async (req, res) => {
  const result = await getStudyAbroadById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateStudyAbroadController = async (req, res) => {
  const result = await updateStudyAbroad(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteStudyAbroadController = async (req, res) => {
  const result = await deleteStudyAbroad(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};
