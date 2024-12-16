import express from 'express';
import { create,getAll,getByName,deleteById,editById,getById } from '../controllers/blog.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,create)
// GET ALL PROPERTY
router.get("/", getAll)
router.get("/name/:name", getByName)
// GET BY ID
router.get("/get-one/:id",getById)

// UPDATE PROPERTY BY ID
router.put("/:id", verifyAdmin,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router