import { Router } from "express";

import {
  protectAdmin,
} from "../../middlewares/protectAdmin.js";

import {

  createStudentController,
  getStudentsController,
  getStudentsByInstituteController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,

} from "./instituteStudent.controller.js";

const router = Router();


// CREATE
router.post(
  "/",
  protectAdmin,
  createStudentController
);


// GET ALL
router.get(
  "/",
  protectAdmin,
  getStudentsController
);


// GET BY INSTITUTE
router.get(
  "/institute/:instituteId",
  protectAdmin,
  getStudentsByInstituteController
);


// GET BY ID
router.get(
  "/:id",
  protectAdmin,
  getStudentByIdController
);


// UPDATE
router.put(
  "/:id",
  protectAdmin,
  updateStudentController
);


// DELETE
router.delete(
  "/:id",
  protectAdmin,
  deleteStudentController
);

export default router;