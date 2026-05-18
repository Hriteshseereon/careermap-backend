import { Router } from "express";
import * as ctrl from "./entranceexam.controller.js";
import { protectAdmin } from "../../middlewares/protectAdmin.js";
const router = Router();

router.post("/", protectAdmin, ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id",protectAdmin, ctrl.update);
router.delete("/:id",protectAdmin, ctrl.remove);

export default router;