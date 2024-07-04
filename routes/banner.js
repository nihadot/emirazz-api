import express from 'express';
import { create,getAll,deleteById,editById } from '../controllers/banner.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE BANNER
router.post("/",verifyAdmin,upload,create)
// GET ALL BANNER
router.get("/", getAll)
// UPDATE BANNER BY ID
router.put("/",verifyAdmin,upload, editById)
// DELETE BANNER BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router