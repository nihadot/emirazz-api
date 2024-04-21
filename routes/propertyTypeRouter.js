import express from 'express';
import { create,getAll,deleteById,editById,getCounts} from '../controllers/property-type.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin, create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin, editById)
// COUNTS PROPERTY 
router.put("/counts", getCounts)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 

export default router