import express from 'express';
import { create,getAll,deleteById,getAllLanguages,editById ,
    createLanguage,
    deleteLanguage,
    updateLanguage,
    createCountry,
    getAllCountries,
    deleteCountry,
    updateCountry,
} from '../controllers/banner.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


// CREATE BANNER
router.post("/",verifyAdmin,upload,create)
// GET ALL BANNER
router.get("/", getAll)
// UPDATE BANNER BY ID
router.put("/",verifyAdmin,upload, editById)
// DELETE BANNER BY ID
router.delete("/:id", verifyAdmin, deleteById) 

router.post("/create-language", verifyAdmin, createLanguage) 
router.get("/get-all-languages", verifyAdmin, getAllLanguages) 
router.delete("/delete-language/:id", verifyAdmin, deleteLanguage) 
router.put("/update-language/:id", verifyAdmin, updateLanguage) 




// country

router.post("/create-country", verifyAdmin, createCountry) 
router.get("/get-all-countries", verifyAdmin, getAllCountries) 
router.delete("/delete-country/:id", verifyAdmin, deleteCountry) 
router.put("/update-country/:id", verifyAdmin, updateCountry) 


export default router