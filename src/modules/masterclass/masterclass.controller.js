import {
  createMasterClass,
  getMasterClasses,
  getMasterClassById,
  updateMasterClass,
  deleteMasterClass,
} from "./masterclass.service.js";

// CREATE
export const createMasterClassController = async (req, res) => {
  const result = await createMasterClass(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getMasterClassesController = async (req, res) => {
  const result = await getMasterClasses();
  res.status(200).json(result);
};

// GET BY ID
export const getMasterClassByIdController = async (req, res) => {
  const result = await getMasterClassById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateMasterClassController = async (req, res) => {
  const result = await updateMasterClass(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteMasterClassController = async (req, res) => {
  const result = await deleteMasterClass(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};