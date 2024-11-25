import express from "express";
import { create, getAll, deleteById, editById,getById } from "../controllers/city.js";
import { verifyAdmin } from "../middleware/verifyingToken.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// CREATE PROPERTY
router.post("/", verifyAdmin, create);
// GET ALL PROPERTY
router.get("/:id", getById);
router.get("/", getAll);
// UPDATE PROPERTY BY ID
router.put("/:id", verifyAdmin, editById);
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById);

export default router;
