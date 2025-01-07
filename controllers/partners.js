import slugify from "slugify";
import Counts from "../model/counts.js";
import NewsModel from "../model/News.js";
import GalleryModel from "../model/Gallery.js";
import PartnersModel from "../model/Partners.js";

export const createPartners = async (req, res, next) => {
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
    const slug = await PartnersModel.findOne({ slug: slugName });

    if (slug) {
      return res.status(400).json({ message: "Titles already exist" }).end();
    }


    // Create a new gallery instance
    const newPartners = new PartnersModel({
    name,
      slug:slugName,
      imageLink
    });

    // Save to the database
    const partners = await newPartners.save();

    const isCount = await Counts.findOne({});
    if (isCount) {
      if(isCount.countOfPartners){
        isCount.countOfPartners = (isCount.countOfPartners) + 1;
      }else{
        isCount.countOfPartners = 1;
      }
      await isCount.save();

    } else {
      new Counts({ countOfPartners: 1 }).save();
    }

    res.status(201).json({
      success: true,
      message: "Gallery created successfully!",
      data: partners,
    });

  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const fetchAllPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    // Fetch partners sorted by date (descending) and exclude `createdAt`
    const partners = await PartnersModel.find({isDelete:false}, { createdAt: 0 }) // Exclude `createdAt`
      .sort({ date: -1 }) // Sort by `date` in descending order
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use `lean()` for plain objects
console.log(partners)
    // Get total count of news for pagination metadata
    const totalCount = await Counts.findOne();

    res.status(200).json({
      success: true,
      data: partners,
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

export const getPartnersBySlug = async (req, res) => {
  try {

    console.log(req.body,'body')
    console.log(req.params.slug,'body')
    return true;
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await PartnersModel.findOne({slug:req.params.slug});

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

export const updatePartnersBySlug = async (req, res) => {
  try {
    if(!req.params.slug){
      return res.status(400).json({ message: "Id not Provided" });
    }

    const result = await PartnersModel.findOne({slug:req.params.slug});


    if(!result){
      return res.status(400).json({ message: "No available" });
    }

    const data = {
      ...req.body
    }

    await PartnersModel.findByIdAndUpdate(result._id, { $set: { ...data } });
  
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

export const deletePartnersById = async (req, res, next) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingPartners = await PartnersModel.findById(req.params.id);

    if (!existingPartners) {
      return res.status(400).json({ message: "Partners Not Exist!!" }).end();
    }

    await PartnersModel.findByIdAndUpdate(req.params.id,{$set:{isDelete:true}});

    const isCount = await Counts.findOne({});
    if(isCount && isCount.countOfPartners !== 0){
        isCount.countOfPartners = (isCount.countOfPartners)-1;
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
