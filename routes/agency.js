import express from 'express';
import { createAgency,getAllAgency,editAgencyById,deleteAgencyById,assignedByAgency } from '../controllers/agency.js';
import { verifyAdmin, verifyAdminOrAgency } from '../middleware/verifyingToken.js';
import { getAllAgencyById } from '../controllers/agency.js';


const router = express.Router()


// CREATE AGENCY
router.post("/create-agency",verifyAdmin,createAgency)
// GET ALL AGENCY
router.get("/get-agency", verifyAdmin,getAllAgency)
// GET AGENCY BY ID
router.get("/get-agency/:id", verifyAdminOrAgency,getAllAgencyById)
// UPDATE AGENCY BY ID
router.put("/update-agency/:id",verifyAdmin, editAgencyById)
// DELETE AGENCY BY ID
router.delete("/delete-agency/:id", verifyAdmin, deleteAgencyById) 

router.put("/assigned-by-agency",verifyAdmin, assignedByAgency)


export default router