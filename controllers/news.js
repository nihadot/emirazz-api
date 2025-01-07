import BlogModel from "../model/Blog.js";
import slugify from "slugify";
import Counts from "../model/counts.js";
import NewsModel from "../model/News.js";

export const createNewNews = async (req, res, next) => {
  try { 

    const {
      newsTitle,
      newsTitleAr,
      newsDescription,
      newsDescriptionAr,
      newsDate,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
    } = req.body;

    if (!imageLink) {
      return res.status(400).json({ message: "Image not exist" }).end();
    }

    // console.log(req.body)
    
    // Create slug URLs
    const slugNameEn = slugify(req.body.newsTitle, { lower: true });
    const slugNameAr = slugify(req.body.newsTitleAr, { lower: true });
    console.log(slugNameAr,slugNameEn)
    const isSlugEn = await NewsModel.findOne({ slugNameEn: slugNameEn });
    const isSlugAr = await NewsModel.findOne({ slugNameAr: slugNameAr });

    if (isSlugEn) {
      return res.status(400).json({ message: "Titles already exist" }).end();
    }

    if (isSlugAr) {
      return res.status(400).json({ message: "Titles already exist" }).end();
    }

    // Create a new news instance
    const newNews = new NewsModel({
      newsTitle,
      newsTitleAr,
      newsDescription,
      newsDescriptionAr,
      newsDate,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
      slugNameAr,
      slugNameEn,
    });

    // Save to the database
    const savedNews = await newNews.save();

    const isCount = await Counts.findOne({});
    if (isCount) {
      if(isCount.countOfNews){
        isCount.countOfNews = (isCount.countOfNews) + 1;
      }else{
        isCount.countOfNews = 1;
      }
      await isCount.save();

    } else {
      new Counts({ countOfNews: 1 }).save();
    }

    res.status(201).json({
      success: true,
      message: "News created successfully!",
      data: savedNews,
    });

  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const fetchAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    // Fetch news sorted by date (descending) and exclude `createdAt`
    const news = await NewsModel.find({isDelete:false}, { createdAt: 0 }) // Exclude `createdAt`
      .sort({ date: -1 }) // Sort by `date` in descending order
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use `lean()` for plain objects

    // Get total count of news for pagination metadata
    const totalCount = await Counts.findOne();

    res.status(200).json({
      success: true,
      data: news,
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

export const getNewsBySlug = async (req, res) => {
  try {
    
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await NewsModel.findOne({slugNameEn:req.params.slug});
   
    if(!result){
      return res.status(400).json({ message: "Not available" });
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

    const result = await NewsModel.findOne({slugNameEn:req.params.slug});


    if(!result){
      return res.status(400).json({ message: "No available" });
    }

    const data = {
      ...req.body
    }

    await NewsModel.findByIdAndUpdate(result._id, { $set: { ...data } });
  
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

export const deleteNewsById = async (req, res, next) => {
  try {

    if (!req.params.newsId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBlog = await NewsModel.findById(req.params.newsId);

    if (!existingBlog) {
      return res.status(400).json({ message: "News Not Exist!!" }).end();
    }

    await NewsModel.findByIdAndUpdate(req.params.newsId,{$set:{isDelete:true}});

    const isCount = await Counts.findOne({});
    if(isCount && isCount.countOfNews !== 0){
        isCount.countOfNews = (isCount.countOfNews)-1;
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
