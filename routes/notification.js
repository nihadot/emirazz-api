import express from "express";
import { create, getAll, deleteById, editById } from "../controllers/notification.js";
import { verifyAdmin } from "../middleware/verifyingToken.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// CREATE NOTIFICATION
router.post("/", verifyAdmin, upload, create);
// GET ALL NOTIFICATION
router.get("/", getAll);
// UPDATE NOTIFICATION BY ID
router.put("/", verifyAdmin, upload, editById);
// DELETE NOTIFICATION BY ID
router.delete("/:id", verifyAdmin, deleteById);

export default router;
