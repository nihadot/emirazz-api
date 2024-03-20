import express from 'express';
import { create,getAll,deleteById,editById } from '../controllers/blog.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/", verifyAdmin,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router