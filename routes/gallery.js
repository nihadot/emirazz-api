import express from 'express';
import { createGallery, getNewsBySlug, updateGalleryBySlug, fetchAllGallery, deleteGalleryById } from '../controllers/gallery.js';
import { createBlogValidation, GalleryValidation } from '../middleware/validation.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';


const router = express.Router()


// Create a new news , and also counted
router.post("/", verifyAdmin, GalleryValidation, createGallery)
// fetch all blogs , 10 each with sorted date wise
router.get("/", fetchAllGallery)
//  delete blog , status isDelete true, decrease the count
router.delete("/:galleryId", verifyAdmin, deleteGalleryById)
// get blog by slug with id
router.get("/:slug", getNewsBySlug)
// update blog with slug and id 
router.put("/:slug", verifyAdmin, GalleryValidation, updateGalleryBySlug)



export default router