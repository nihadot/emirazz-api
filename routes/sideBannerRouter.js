import express from 'express';
import { create,getAll,deleteById, getAllSideBarIsNotAvailbe} from '../controllers/sidebar.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE SIDEBAR
router.post("/",verifyAdmin,  upload,create)

// get not availbe side bar ids
router.get("/not-available", getAllSideBarIsNotAvailbe)
// GET ALL SIDEBAR
router.get("/", getAll)
// DELETE SIDEBAR BY ID
router.delete("/:id", verifyAdmin, deleteById) 


export default router