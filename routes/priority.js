import express from 'express';
import { getAll, getAllPriorityOfCities, getAllPriorityOfDevelopers,deletePriority,checkPossibilityOfCount} from '../controllers/priority.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';

const router = express.Router()

// GET ALL AVAILBLE PRIORITIES
router.get("/", getAll)
//  get developers priority
router.get("/developers", getAllPriorityOfDevelopers)
//  get city priority
router.get("/city", getAllPriorityOfCities)
// DELETE SIDEBAR BY ID UNDER PROPERTY ID
router.delete("/:id/:type", verifyAdmin, deletePriority) 
router.post("/generate-fingerprint-id", checkPossibilityOfCount) 


export default router