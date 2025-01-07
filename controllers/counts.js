import BlogModel from "../model/Blog.js";
import { deleteFile } from "../middleware/deleteFile.js";
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
    
   // create slug url
   const slugNameEn = slugify(req.body.blogTitle,{lower:true});
   const slugNameAr = slugify(req.body.blogTitleAr,{lower:true});

   console.log(slugNameAr,slugNameEn);
   
   return true
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

    const isCount = await Counts.findOne({});
    console.log(isCount,'isCount')
    if(isCount){
      isCount.countOfBlogs = (isCount.countOfBlogs)+1;
      await isCount.save();
    }else{
      new Counts({countOfBlogs:1}).save();
      
    }

    // Save to the database
    const savedBlog = await newBlog.save();

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

export const getAll = async (req, res, next) => {
  try {
    const getBlogs = await BlogModel.find();

    getBlogs.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({ result: getBlogs }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const getById = async (req, res, next) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "Id not Provided" });
    const getBlog = await BlogModel.findById(req.params.id);

    return res.status(200).json({ result: getBlog }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {

    console.log(req.body)

    if(!req.body.blogTitle){
      return res.status(400).json({ message: "Blog Title is required" });
     }
 
     if(!req.body.blogBody){
       return res.status(400).json({ message: "Blog Body is required" });
     }
 
     if(!req.body.date){
       return res.status(400).json({ message: "Date is required" });
     }
 
     if(!req.body.imageFile){
       return res.status(400).json({ message: "Image file is required" });
     }
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBlog = await BlogModel.findById(req.params.id);

    if (!existingBlog) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    let obj = {
      ...req.body,
    };

    
    await BlogModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...obj } },
      { new: true }
    );

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBlog = await BlogModel.findById(req.params.id);

    if (!existingBlog) {
      return res.status(400).json({ message: "Blog Not Exist!!" }).end();
    }

    await BlogModel.findByIdAndDelete(req.params.id);

    if (existingBlog?.mainImgaeLink && existingBlog?.mainImgaeLink?.length > 0) {
      const filename = existingBlog.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        const response = await deleteFile(filePath);
      } catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }
    }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};




export const getByName = async (req, res, next) => {
  try {
    if (!req.params.name) {
      return res.status(400).json({ message: "Name not provided" });
    }

    // Query the database
    const getBlog = await BlogModel.findOne({slug:req.params.name});

 
    if (!getBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ result: getBlog });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error!" });
  }
};

