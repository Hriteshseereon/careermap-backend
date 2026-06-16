import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { StaffRepository }
from "./staff.repository.js";

export const createStaff =
async (body) => {

  const existing =
    await StaffRepository.findByEmail(
      body.email
    );

  if(existing){
    throw new Error(
      "Email already exists"
    );
  }

  const password =
    await bcrypt.hash(
      body.password,
      12
    );

  const user =
    await StaffRepository.create({
      name: body.name,
      email: body.email,
      password,
      roleId: Number(body.roleId),
    });

  return user;
};

export const loginStaff =
async (email,password) => {

  const staff =
    await StaffRepository.findByEmail(
      email
    );

  if(!staff){
    throw new Error(
      "Staff not found"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      staff.password
    );

  if(!isMatch){
    throw new Error(
      "Invalid credentials"
    );
  }

  const token =
    jwt.sign(
      {
        id: staff.id,
        roleId: staff.roleId,
        type:"staff"
      },
      process.env.STAFF_SECRET,
      {
        expiresIn:"1d"
      }
    );

  return {
    token,
    staff,
  };
};

export const getAllStaff =
async () => {
  return StaffRepository.findAll();
};

export const getStaffById =
async (id) => {
  return StaffRepository.findById(id);
};

export const deleteStaff =
async (id) => {
  return StaffRepository.delete(id);
};