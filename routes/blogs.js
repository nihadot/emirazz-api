import express from 'express';
import { createNewBlog, fetchBlogs, deleteBlogById, getBlogBySlug, updateBlogBySlug } from '../controllers/blogs.js';
import { createBlogValidation } from '../middleware/validation.js';
import { verifyAdmin } from '../middleware/verifyingToken.js';


const router = express.Router()


// Create a new blog , and also counted
router.post("/", verifyAdmin, createBlogValidation, createNewBlog)
// fetch all blogs , 10 each with sorted date wise
router.get("/", fetchBlogs)
//  delete blog , status isDelete true, decrease the count
router.delete("/:blogId", verifyAdmin, deleteBlogById)
// get blog by slug with id
router.get("/:slug", getBlogBySlug)
// update blog with slug and id 
router.put("/:slug", verifyAdmin, createBlogValidation, updateBlogBySlug)



export default router