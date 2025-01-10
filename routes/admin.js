import express from 'express';
import { login,register} from '../controllers/admin.js';
import { loginLimiter, loginValidation } from '../middleware/validation.js';


const router = express.Router()


// LOGIN
router.post("/login",loginValidation, login)
router.post("/register", register)



export default router