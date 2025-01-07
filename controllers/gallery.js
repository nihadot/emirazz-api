import slugify from "slugify";
import Counts from "../model/counts.js";
import NewsModel from "../model/News.js";
import GalleryModel from "../model/Gallery.js";

export const createGallery = async (req, res, next) => {
  try { 

    const {
  name,
  imageLink,
    } = req.body;

    if (!imageLink) {
      return res.status(400).json({ message: "Image not exist" }).end();
    }
 
    // Create slug URLs
    const slugName = slugify(req.body.name, { lower: true });
    const slug = await GalleryModel.findOne({ slug: slugName });

    if (slug) {
      return res.status(400).json({ message: "Titles already exist" }).end();
    }


    // Create a new gallery instance
    const newGallery = new GalleryModel({
    name,
      slug:slugName,
      imageLink
    });

    // Save to the database
    const savedGallery = await newGallery.save();

    const isCount = await Counts.findOne({});
    if (isCount) {
      if(isCount.countOfGallery){
        isCount.countOfGallery = (isCount.countOfGallery) + 1;
      }else{
        isCount.countOfGallery = 1;
      }
      await isCount.save();

    } else {
      new Counts({ countOfGallery: 1 }).save();
    }

    res.status(201).json({
      success: true,
      message: "Gallery created successfully!",
      data: savedGallery,
    });

  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const fetchAllGallery = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    // Fetch gallery sorted by date (descending) and exclude `createdAt`
    const gallery = await GalleryModel.find({isDelete:false}, { createdAt: 0 }) // Exclude `createdAt`
      .sort({ date: -1 }) // Sort by `date` in descending order
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use `lean()` for plain objects

    // Get total count of news for pagination metadata
    const totalCount = await Counts.findOne();

    res.status(200).json({
      success: true,
      data: gallery,
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

export const updateGalleryBySlug = async (req, res) => {
  try {
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await GalleryModel.findOne({slug:req.params.slug});


    if(!result){
      return res.status(400).json({ message: "No available" });
    }

    const data = {
      ...req.body
    }

    await GalleryModel.findByIdAndUpdate(result._id, { $set: { ...data } });
  
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

export const deleteGalleryById = async (req, res, next) => {
  try {

    if (!req.params.galleryId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingGallery = await GalleryModel.findById(req.params.galleryId);

    if (!existingGallery) {
      return res.status(400).json({ message: "Gallery Not Exist!!" }).end();
    }

    await GalleryModel.findByIdAndUpdate(req.params.galleryId,{$set:{isDelete:true}});

    const isCount = await Counts.findOne({});
    if(isCount && isCount.countOfGallery !== 0){
        isCount.countOfGallery = (isCount.countOfGallery)-1;
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
