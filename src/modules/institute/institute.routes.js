import { Router } from "express";

import {

  createInstituteController,
  loginInstituteController,
  getInstitutesController,
  getInstituteByIdController,
  updateInstituteController,
  deleteInstituteController,
   getInstituteDashboardController

} from "./institute.controller.js";

import {
  protectAdmin
} from "../../middlewares/protectAdmin.js";
import {protectInstitute} from "../../middlewares/protectInstitute.js"
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
  "/dashboard",
  protectInstitute,
  getInstituteDashboardController
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