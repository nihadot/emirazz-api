import express from 'express';
import { getAll} from '../controllers/priority.js';

const router = express.Router()

// GET ALL AVAILBLE PRIORITIES
router.get("/", getAll)

export default router