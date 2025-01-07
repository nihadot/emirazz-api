import BlogModel from "../model/Blog.js";
import slugify from "slugify";
import Counts from "../model/counts.js";

export const createNewBlog = async (req, res, next) => {
  try { 

    const {
      blogTitle,
      blogTitleAr,
      blogDescription,
      blogDescriptionAr,
      blogDate,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
    } = req.body;

    if(!imageLink){
      return res.status(400).json({ message: "Image not exist" }).end();
    }
    
   // create slug url
   const slugNameEn = slugify(req.body.blogTitle,{lower:true});
   const slugNameAr = slugify(req.body.blogTitleAr,{lower:true});

   const isSlugEn = await BlogModel.findOne({slugNameEn: slugNameEn});
   const isSlugAr = await BlogModel.findOne({slugNameAr: slugNameAr});

    if(isSlugEn){
      return res.status(400).json({ message: "Titles already exists" }).end();
    }

    if(isSlugAr){
      return res.status(400).json({ message: "Titles already exists" }).end();
    }

    // Create a new blog instance
    const newBlog = new BlogModel({
      blogTitle,
      blogTitleAr,
      blogDescription,
      blogDescriptionAr,
      blogDate,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
      slugNameAr,
      slugNameEn
    });

    // Save to the database
    const savedBlog = await newBlog.save();

    const isCount = await Counts.findOne({});
    if(isCount){
      isCount.countOfBlogs = (isCount.countOfBlogs)+1;
      await isCount.save();
    }else{
      new Counts({countOfBlogs:1}).save();
    }

    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      data: savedBlog,
    });


  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const fetchBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    const result = await BlogModel.countDocuments();

    // Fetch blogs sorted by date (descending) and exclude `createdAt`
    const blogs = await BlogModel.find({isDelete:false}, { createdAt: 0 }) // Exclude `createdAt`
      .sort({ date: -1 }) // Sort by `date` in descending order
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use `lean()` for plain objects

    // Get total count of blogs for pagination metadata
    const totalCount = await Counts.findOne();

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  }  catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await BlogModel.findOne({slugNameEn:req.params.slug});

    if(!result){
      return res.status(400).json({ message: "Nou available" });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  }  catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const updateBlogBySlug = async (req, res) => {
  try {
 
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await BlogModel.findOne({slugNameEn:req.params.slug});

    if(!result.imageLink){
      return res.status(400).json({ message: "Image not exist" }).end();

    }

    if(!result){
      return res.status(400).json({ message: "No available" });
    }

    const data = {
      ...req.body
    }

    await BlogModel.findByIdAndUpdate(result._id, { $set: { ...data } });
  

    res.status(200).json({
      success: true,
    });

  }  catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteBlogById = async (req, res, next) => {
  try {

    if (!req.params.blogId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBlog = await BlogModel.findById(req.params.blogId);

    if (!existingBlog) {
      return res.status(400).json({ message: "Blog Not Exist!!" }).end();
    }

    await BlogModel.findByIdAndUpdate(req.params.blogId,{$set:{isDelete:true}});

    const isCount = await Counts.findOne({});
    if(isCount && isCount.countOfBlogs !== 0){
        isCount.countOfBlogs = (isCount.countOfBlogs)-1;
        await isCount.save();
    }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
