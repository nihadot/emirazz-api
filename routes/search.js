import express from 'express';
import { searchQuery} from '../controllers/admin.js';
import { verifyAdmin, verifyToken } from '../middleware/verifyingToken.js';


const router = express.Router()



router.get("/", searchQuery) 



export default router