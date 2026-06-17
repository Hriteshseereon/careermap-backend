import {

  createInstitute,
  loginInstitute,
  getInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,

} from "./institute.service.js";


export const createInstituteController =
async (req,res)=>{

  const result =
    await createInstitute(
      req.body
    );

  res
    .status(
      result.success
      ? 201
      : 400
    )
    .json(result);
};


export const loginInstituteController =
async (req,res)=>{

  const result =
    await loginInstitute(
      req.body
    );

  res
    .status(
      result.success
      ? 200
      : 400
    )
    .json(result);
};


export const getInstitutesController =
async(req,res)=>{

  const result =
    await getInstitutes();

  res.json(result);
};


export const getInstituteByIdController =
async(req,res)=>{

  const result =
    await getInstituteById(
      req.params.id
    );

  res.json(result);
};


export const updateInstituteController =
async(req,res)=>{

  const result =
    await updateInstitute(
      req.params.id,
      req.body
    );

  res.json(result);
};


export const deleteInstituteController =
async(req,res)=>{

  const result =
    await deleteInstitute(
      req.params.id
    );

  res.json(result);
};