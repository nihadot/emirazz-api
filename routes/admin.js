import express from 'express';
import { register,login,getAdmin,getAllCountAll } from '../controllers/admin.js';
import { verifyAdmin, verifyToken } from '../middleware/verifyingToken.js';


const router = express.Router()


// CREATE
router.post("/register", register)
// LOGIN
router.post("/login", login)
// GET DETAILS OF ADMIN BY TOKEN
router.get("/profile", verifyAdmin, getAdmin) 
router.get("/count-all", verifyAdmin, getAllCountAll) 



export default router