import express from 'express';
import { create,getAll,deleteById,editById,getById } from '../controllers/blog.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,upload,create)
// GET ALL PROPERTY
router.get("/", getAll)
// GET BY ID
router.get("/get-one/:id",getById)

// UPDATE PROPERTY BY ID
router.put("/", verifyAdmin,upload,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router