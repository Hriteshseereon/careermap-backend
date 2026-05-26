import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./careerpath.controller.js";

const router = Router();

// 🔹 CREATE
router.post("/", create);

// 🔹 GET ALL
router.get("/", getAll);

// 🔹 GET BY ID (safe route)
router.get("/id/:id", getById);

// 🔹 UPDATE
router.put("/:id", update);

// 🔹 DELETE
router.delete("/:id", remove);

export default router;