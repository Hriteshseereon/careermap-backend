import {
  createStaff,
  loginStaff,
  getAllStaff,
  getStaffById,
  deleteStaff
}
from "./staff.service.js";

export const createStaffController =
async(req,res)=>{

  try{

    const data =
      await createStaff(
        req.body
      );

    res.status(201).json({
      success:true,
      data,
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};

export const loginStaffController =
async(req,res)=>{

  try{

    const data =
      await loginStaff(
        req.body.email,
        req.body.password
      );

    res.json({
      success:true,
      ...data
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};

export const getAllStaffController =
async(req,res)=>{

  const data =
    await getAllStaff();

  res.json({
    success:true,
    data
  });
};

export const getStaffByIdController =
async(req,res)=>{

  const data =
    await getStaffById(
      req.params.id
    );

  res.json({
    success:true,
    data
  });
};

export const deleteStaffController =
async(req,res)=>{

  await deleteStaff(
    req.params.id
  );

  res.json({
    success:true,
    message:"Deleted"
  });
};