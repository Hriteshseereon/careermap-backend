import bcrypt from "bcryptjs";

import {
  InstituteStudentRepository,
} from "./instituteStudent.repository.js";


// CREATE
export const createStudent = async (
  body
) => {

  const institute =
    await InstituteStudentRepository.getInstitute(
      body.instituteId
    );

  if (!institute) {
    return {
      success: false,
      message: "Institute not found",
    };
  }

  if (
    institute.users.length >=
    institute.limit
  ) {
    return {
      success: false,
      message:
        "Institute student limit exceeded",
    };
  }

  const existing =
    await InstituteStudentRepository.findByEmail(
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

  const student =
    await InstituteStudentRepository.createStudent({

      firstName:
        body.firstName,

      lastName:
        body.lastName,

      username:
        body.username,

      email:
        body.email,

      password:
        hashedPassword,

      mobile:
        body.mobile,

      instituteId:
        Number(body.instituteId),

      isInstituteStudent:
        true,
    });

  return {
    success: true,
    data: student,
  };
};


// GET ALL
export const getStudents = async () => {

  const data =
    await InstituteStudentRepository.getAllStudents();

  return {
    success: true,
    data,
  };
};


// GET BY INSTITUTE
export const getStudentsByInstitute =
async (instituteId) => {

  const data =
    await InstituteStudentRepository.getStudentsByInstitute(
      instituteId
    );

  return {
    success: true,
    data,
  };
};


// GET BY ID
export const getStudentById =
async (id) => {

  const data =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!data) {
    return {
      success: false,
      message:
        "Student not found",
    };
  }

  return {
    success: true,
    data,
  };
};


// UPDATE
export const updateStudent =
async (
  id,
  body
) => {

  const student =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!student) {
    return {
      success: false,
      message:
        "Student not found",
    };
  }

  const updated =
    await InstituteStudentRepository.updateStudent(
      id,
      {
        firstName:
          body.firstName,

        lastName:
          body.lastName,

        mobile:
          body.mobile,

        status:
          body.status,
      }
    );

  return {
    success: true,
    data: updated,
  };
};


// DELETE
export const deleteStudent =
async (id) => {

  const student =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!student) {
    return {
      success: false,
      message:
        "Student not found",
    };
  }

  await InstituteStudentRepository.deleteStudent(
    id
  );

  return {
    success: true,
    message:
      "Student deleted successfully",
  };
};