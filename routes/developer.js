import express from 'express';
import { create,getAll,deleteById,editById,getDeveloperById ,getDevelopersByName} from '../controllers/developer.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE PROPERTY
router.post("/",verifyAdmin,create)
// GET ALL PROPERTY
router.get("/", getAll)
router.get("/:id", getDeveloperById)
// UPDATE PROPERTY BY ID
router.put("/:id",verifyAdmin, editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 
router.get("/name/:name", verifyAdmin, getDevelopersByName) 


export default router