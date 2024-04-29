import express from 'express';
import { create,getAll,deleteById,editById } from '../controllers/developer.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,upload,create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin,upload, editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router