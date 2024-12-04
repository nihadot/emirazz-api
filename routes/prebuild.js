import express from 'express';
import { verifyAdmin } from '../middleware/verifyingToken.js';
// import { createAgency,getAllAgency,editAgencyById,getProfile,deleteAgencyById,deleteLangUnderAgent,assignedByAgency,loginAgency } from '../controllers/agency.js';
// import { verifyAdmin, verifyAdminOrAgency, verifyAgency } from '../middleware/verifyingToken.js';
// import { getAllAgencyById } from '../controllers/agency.js';

import {
    syncAllProjectSlug,
    syncAllCitiesSlug,
    syncAllBlogSlug,
    syncAllDevelopersSlug
} from "../controllers/prebuilt.js";

const router = express.Router()

// // LOGIN AGENCY
// router.post("/login",loginAgency)
// // CREATE AGENCY
router.get("/sync-all-project-slug",syncAllProjectSlug)
// // GET ALL AGENCY
router.get("/sync-all-cities-slug",syncAllCitiesSlug)
// // GET AGENCY BY ID
router.get("/sync-all-blogs-slug",syncAllBlogSlug)
router.get("/sync-all-developers-slug",syncAllDevelopersSlug)

// router.get("/get-agency/:id", verifyAdminOrAgency,getAllAgencyById)
// // UPDATE AGENCY BY ID
// router.put("/update-agency/:id",verifyAdmin, editAgencyById)
// // DELETE AGENCY BY ID
// router.delete("/delete-agency/:id", verifyAdmin, deleteAgencyById) 

// router.put("/assigned-by-agency",verifyAdmin, assignedByAgency)

// router.delete("/delete/lang/:langId/:agencyId", verifyAdmin, deleteLangUnderAgent) 

// router.get("/profile/", verifyAgency,getProfile)

export default router