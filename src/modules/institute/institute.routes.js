import { Router } from "express";

import {

  createInstituteController,
  loginInstituteController,
  getInstitutesController,
  getInstituteByIdController,
  updateInstituteController,
  deleteInstituteController,

} from "./institute.controller.js";

import {
  protectAdmin
} from "../../middlewares/protectAdmin.js";

const router = Router();


// LOGIN
router.post(
  "/login",
  loginInstituteController
);


// CRUD

router.post(
  "/",
  protectAdmin,
  createInstituteController
);

router.get(
  "/",
  protectAdmin,
  getInstitutesController
);

router.get(
  "/:id",
  protectAdmin,
  getInstituteByIdController
);

router.put(
  "/:id",
  protectAdmin,
  updateInstituteController
);

router.delete(
  "/:id",
  protectAdmin,
  deleteInstituteController
);

export default router;