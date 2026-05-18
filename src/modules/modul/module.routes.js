import upload from "../../middlewares/upload.js";
import { createmodulecontroller,getModuleController,getModuleByIdController,updateModuleController,deleteModuleController } from "./module.controller.js";
import {Router} from "express";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
import { use } from "react";

const router = Router();
router.post("/",protectAdmin,upload.single("image"),createmodulecontroller);
router.get("/",getModuleController)
router.get("/:id",getModuleByIdController);
router.put("/:id",protectAdmin,upload.single("image"),updateModuleController);
router.delete("/:id",protectAdmin,deleteModuleController);

export default router;