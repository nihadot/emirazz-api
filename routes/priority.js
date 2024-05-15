import express from 'express';
import { getAll, getAllPriorityOfCities, getAllPriorityOfDevelopers} from '../controllers/priority.js';

const router = express.Router()

// GET ALL AVAILBLE PRIORITIES
router.get("/", getAll)
//  get developers priority
router.get("/developers", getAllPriorityOfDevelopers)
//  get city priority
router.get("/city", getAllPriorityOfCities)


export default router