import { createInstitutionController,getInstitutionsController,updateInstitutionController,deleteInstitutionController,getInstitutionByIdController } from "./institution.controller.js";
import { Router } from "express";
import upload from "../../middlewares/upload.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";

const router = Router();
router.post("/", protectAdmin, upload.single("image"), createInstitutionController);
router.get("/", getInstitutionsController);
router.get("/:id", getInstitutionByIdController);
router.put("/:id", protectAdmin, upload.single("image"), updateInstitutionController);
router.delete("/:id", protectAdmin, deleteInstitutionController);

export default router;