import express from 'express';
import { create,getAll,deleteById,editById,getById,createEnquiry ,getEnquiry, getCounts,addEnq} from '../controllers/property.js';
import { verifyAdmin, verifyToken } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,  upload,create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin, upload,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 

router.post("/form", createEnquiry) 
router.get("/form",verifyAdmin, getEnquiry) 
router.get("/counts", getCounts) 
router.get("/:id", getById)

router.post("/enq", addEnq) 




export default router