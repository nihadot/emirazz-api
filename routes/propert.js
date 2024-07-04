import express from 'express';
import { create,getAll,deleteById,editById,getProjectsByCityId,getProjectsByDevelopersId,getById,createEnquiry ,getEnquiry, getCounts,addEnq,updateAdsStatus,deleteSmallImage,updateStatus, getSearchProperty, getProjectsByPropertyTypeId} from '../controllers/property.js';
import { verifyAdmin, verifyToken } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


router.get("/search", getSearchProperty) 
// CREATE PROPERTY
router.post("/",verifyAdmin,  upload,create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin, upload,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 

router.post("/form", createEnquiry) 
router.get("/form",verifyAdmin, getEnquiry) 
router.put("/form",verifyAdmin, updateStatus) 
router.put("/ads",verifyAdmin, updateAdsStatus) 
router.get("/counts", getCounts) 
router.get("/:id", getById)

router.post("/enq", addEnq) 
router.post("/small-image/:id", deleteSmallImage) 

router.get("/property-type/:id", getProjectsByPropertyTypeId) 
router.get("/city/:id", getProjectsByCityId) 
router.get("/developers/:id", getProjectsByDevelopersId) 



export default router