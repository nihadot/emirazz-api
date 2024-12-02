import express from "express";
import { create, getAll, deleteById, editById,getNotificationById } from "../controllers/notification.js";
import { verifyAdmin } from "../middleware/verifyingToken.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// CREATE NOTIFICATION
router.post("/", verifyAdmin, upload, create);
// GET ALL NOTIFICATION
router.get("/", getAll);
// UPDATE NOTIFICATION BY ID
router.put("/update-notification/:id", verifyAdmin, editById);
// DELETE NOTIFICATION BY ID
router.delete("/:id", verifyAdmin, deleteById);
// NOTIFICATION GET BY ID
router.get("/get-notification/:id", verifyAdmin, getNotificationById);

export default router;
