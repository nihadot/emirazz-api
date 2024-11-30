import express from 'express';
import { 
    create,
    getAll,
    deleteById,
    editById,
    getProjectsByCityId,
    getProjectsByDevelopersId,
    getById,
    createEnquiry ,
    getEnquiry, 
    getCounts,
    addEnq,
    updateAdsStatus,
    deleteSmallImage,
    updateStatus, 
    getSearchProperty,
    getProjectsByPropertyTypeId,
    getEnquiryUnderAgency,
    enqChangeNoteStatus,
    deleteExistingCityByPropertyIdAndCityId,
    deleteExistingPropertyTypeByPropertyIdAndPropertyTypeId,
    updateToggleLock,
    updateProjectBasicDetails,
    updatePropertyImage,
    deleteProjectByIdImage,
    updateOtherOptions,
    deleteCityFromProjectById,
    deletePropertyTypeFromProjectById,
    deletePriorityFromProjectById,
    deleteAdsFromProjectById,
    getPropertyCountFromProject,
    updateProductStatusToPublic
} from '../controllers/property.js';
import { verifyAdmin, verifyAdminOrAgency, verifyToken } from '../middleware/verifyingToken.js';
import { upload } from '../middleware/multer.js';


const router = express.Router()


router.get("/search", getSearchProperty) 
// CREATE PROPERTY
router.post("/",verifyAdmin,create)
// GET ALL PROPERTY
router.get("/", getAll)
// UPDATE PROPERTY BY ID
router.put("/",verifyAdmin, upload,editById)
// DELETE PROPERTY BY ID
router.delete("/:id", verifyAdmin, deleteById) 

router.post("/form", createEnquiry) 
router.get("/form",verifyAdmin, getEnquiry) 
router.get("/form/agency",verifyAdminOrAgency, getEnquiryUnderAgency) 
router.put("/form",verifyAdminOrAgency, updateStatus) 
router.put("/ads",verifyAdmin, updateAdsStatus) 
router.get("/counts", getCounts) 
router.get("/:id", getById)

router.post("/enq", addEnq) 
router.post("/small-image/:id", deleteSmallImage) 

router.get("/property-type/:name", getProjectsByPropertyTypeId) 
router.get("/city/:id", getProjectsByCityId) 
router.get("/developers/:id", getProjectsByDevelopersId) 

router.put("/enq-change-note/:id", enqChangeNoteStatus) 
// router.put("/enq-change-note/:id", enqChangeNoteStatus) 

router.delete("/delete-existing-city/:cityId/:propertyId", deleteExistingCityByPropertyIdAndCityId) 
router.put("/enq-toggle-lock/:lockStatus/:enquiryId", updateToggleLock) 
router.put("/details/:id",verifyAdmin, updateProjectBasicDetails) 
router.delete("/delete-image/:id",verifyAdmin, deleteProjectByIdImage) ;

router.put("/image/:id",verifyAdmin, updatePropertyImage); 
router.put("/update-other-options/:id",verifyAdmin, updateOtherOptions); 
router.delete("/city/delete/:projectId/:cityId",verifyAdmin, deleteCityFromProjectById); 
router.delete("/property-type/delete/:projectId/:typeId",verifyAdmin, deletePropertyTypeFromProjectById); 
router.delete("/delete/priority/:projectId/:item",verifyAdmin, deletePriorityFromProjectById);
router.delete("/delete/ads/:projectId",verifyAdmin, deleteAdsFromProjectById);
router.put("/update/to-publish/:id",verifyAdmin, updateProductStatusToPublic);


router.get("/get-property-type/count", getPropertyCountFromProject);


export default router