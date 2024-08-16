import express from 'express';
import { create,getAll,deleteById,editById,getCounts,getAllPropertyType} from '../controllers/property-type.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,upload, create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin,upload, editById)

router.get("/get-all-properties",verifyAdmin, getAllPropertyType)
// COUNTS PROPERTY 
router.put("/counts", getCounts)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 

export default router