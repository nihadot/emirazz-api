import express from 'express';
import { createNewNews, fetchAllNews, deleteNewsById, getNewsBySlug, updateBlogBySlug } from '../controllers/news.js';
import { createBlogValidation, GalleryValidation, NewsValidation } from '../middleware/validation.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';


const router = express.Router()


// Create a new news , and also counted
router.post("/", verifyAdmin, NewsValidation, createNewNews)
// fetch all blogs , 10 each with sorted date wise
router.get("/", fetchAllNews)
//  delete blog , status isDelete true, decrease the count
router.delete("/:newsId", verifyAdmin, deleteNewsById)
// get blog by slug with id
router.get("/:slug", getNewsBySlug)
// update blog with slug and id 
router.put("/:slug", verifyAdmin, NewsValidation, updateBlogBySlug)



export default router