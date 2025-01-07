// import express from 'express';
// import { createPartners, fetchAllPartners, deletePartnersById, getPartnersBySlug, updatePartnersBySlug } from '../controllers/partners.js';
// import { createBlogValidation, GalleryValidation, NewsValidation, PartnersValidation } from '../middleware/validation.js';
// import { verifyAdmin } from '../middleware/verifyingToken.js';


// const router = express.Router()


// // Create a new news , and also counted
// router.post("/", verifyAdmin, PartnersValidation, createPartners)
// // fetch all blogs , 10 each with sorted date wise
// router.get("/", fetchAllPartners)
// //  delete blog , status isDelete true, decrease the count
// router.delete("/:id", verifyAdmin, deletePartnersById)
// // get blog by slug with id
// router.get("/:slug", getPartnersBySlug)
// // update blog with slug and id 
// router.put("/:slug", verifyAdmin, PartnersValidation, updatePartnersBySlug)



// export default router







import express from 'express';
import { 
    createNewContact, 
  fetchContacts, 
} from '../controllers/contact.js';
import { ContactValidation } from '../middleware/validation.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';

const router = express.Router();

// Create a new product
router.post("/", ContactValidation, createNewContact);

// Fetch all products, 10 each, sorted by date
router.get("/", fetchContacts);

export default router;
