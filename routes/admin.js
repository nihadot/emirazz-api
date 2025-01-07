import express from 'express';
import { login} from '../controllers/admin.js';
import { loginLimiter, loginValidation } from '../middleware/validation.js';


const router = express.Router()


// LOGIN
router.post("/login",loginValidation, login)



export default router