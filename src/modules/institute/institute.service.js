import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { InstituteRepository }
from "./institute.repository.js";


// CREATE
export const createInstitute =
async (body) => {

  const existing =
    await InstituteRepository.findByEmail(
      body.email
    );

  if (existing) {
    return {
      success: false,
      message:
        "Email already exists",
    };
  }

  const hashedPassword =
    await bcrypt.hash(
      body.password,
      12
    );

  const institute =
    await InstituteRepository.create({

      name: body.name,

      email: body.email,

      password:
        hashedPassword,

      contract_person:
        body.contract_person,

      mobile:
        body.mobile,

      address:
        body.address,

      limit:
        Number(body.limit) || 100,
    });

  return {
    success: true,
    data: institute,
  };
};


// LOGIN
export const loginInstitute =
async (body) => {

  const institute =
    await InstituteRepository.findByEmail(
      body.email
    );

  if (!institute) {
    return {
      success: false,
      message:
        "Institute not found",
    };
  }

  const match =
    await bcrypt.compare(
      body.password,
      institute.password
    );

  if (!match) {
    return {
      success: false,
      message:
        "Invalid password",
    };
  }

  const token =
    jwt.sign(
      {
        instituteId:
          institute.id,

        type:
          "institute",
      },

      process.env.INSTITUTE_SECRET,

      {
        expiresIn: "1d",
      }
    );

  return {
    success: true,
    token,
    institute,
  };
};


// GET ALL
export const getInstitutes =
async () => {

  const data =
    await InstituteRepository.findAll();

  return {
    success: true,
    data,
  };
};


// GET BY ID
export const getInstituteById =
async (id) => {

  const data =
    await InstituteRepository.findById(
      id
    );

  if (!data) {
    return {
      success: false,
      message:
        "Institute not found",
    };
  }

  return {
    success: true,
    data,
  };
};


// UPDATE
export const updateInstitute =
async (
  id,
  body
) => {

  const data =
    await InstituteRepository.update(
      id,
      {
        name: body.name,

        contract_person:
          body.contract_person,

        mobile:
          body.mobile,

        address:
          body.address,

        status:
          body.status,

        student_allow:
          body.student_allow,

        limit:
          Number(body.limit),
      }
    );

  return {
    success: true,
    data,
  };
};


// DELETE
export const deleteInstitute =
async (id) => {

  await InstituteRepository.delete(
    id
  );

  return {
    success: true,
    message:
      "Institute deleted successfully",
  };
};