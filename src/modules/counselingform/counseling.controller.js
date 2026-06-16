import {
createCounseling,
getCounselings,
getCounselingById,
updateCounseling,
deleteCounseling,
} from "./counseling.services.js";

export const createCounselingController = async (req, res) => {
const result = await createCounseling(req.body);
res.status(result.success ? 201 : 400).json(result);
};

export const getCounselingsController = async (req, res) => {
const result = await getCounselings();
res.status(200).json(result);
};

export const getCounselingByIdController = async (req, res) => {
const result = await getCounselingById(req.params.id);
res.status(result.success ? 200 : 404).json(result);
};

export const updateCounselingController = async (req, res) => {
const result = await updateCounseling(req.params.id, req.body);
res.status(result.success ? 200 : 400).json(result);
};

export const deleteCounselingController = async (req, res) => {
const result = await deleteCounseling(req.params.id);
res.status(result.success ? 200 : 400).json(result);
};
