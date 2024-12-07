import mongoose from "mongoose";
import { deleteFile } from "../middleware/deleteFile.js";
import SideBannerLogo from "../model/SideBanner.js";
import Property from "../model/Property.js";

export const create = async (req, res, next) => {
  try {
 

    if(!req.body.name){
      return res.status(400).json({ message: "Name is required!" }).end();
    }

    if(!req.body.imageFile){
      return res.status(400).json({ message: "Image file is required!" }).end();
    }

    if(!req.body.landScape){
      return res.status(400).json({ message: "Image file is required!" }).end();
    }


    const newSideBar = new SideBannerLogo({...req.body});

    const savedSideBar = await newSideBar.save();
    return res.status(200).json({ result: savedSideBar }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getAllSideBanners = await SideBannerLogo.find();
    const getAllProperties = await Property.find({ isSold: false });
    
    // Create a Map for quick lookup of properties by `adsOptions`
    const propertiesMap = new Map(
      getAllProperties.map((property) => [property?.adsOptions?.toString(), property])
    );
    
    // Combine side banners with their corresponding properties
    const newResultArray = getAllSideBanners.map((banner) => {
      const property = propertiesMap.get(banner._id.toString());
      return property
        ? { property: { ...property._doc }, ...banner._doc }
        : { ...banner._doc };
    });

    return res.status(200).json({ result: newResultArray }).end();
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

    const existBanner = await SideBannerLogo.findById(req.params.id);

    if (!existBanner) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    const existProperty = await Property.findOne({
       adsOptions: new mongoose.Types.ObjectId(req.params.id),
    });

    if (existProperty) {
      return res
        .status(400)
        .json({ message: "Property exist under the Ads!!" })
        .end();
    }

    // console.log(existProperty,'existProperty')

    // return true;

    await SideBannerLogo.findByIdAndDelete(req.params.id);

    // if (existBanner?.mainImgaeLink && existBanner?.mainImgaeLink.length > 0) {
    //   const filePath = `/mainImage/${existBanner?.mainImgaeLink}`;
    //   const response = await deleteFile(filePath);
    // }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

// get all sibdebar by under products

export const getAllSideBarIsNotAvailbe = async (req, res, next) => {
  try {
    const getAllResponse = await Property.find({isSold:false});
    // return true
    const allSidebar = [];
    for (let item of getAllResponse) {
      if (item?.sideBarRef) {
        allSidebar.push(item?.sideBarRef);
      }
    }

    return res.status(200).json({ result: allSidebar }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteByIdUnderProperty = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    if (!req.params.property) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existBanner = await SideBannerLogo.findById(req.params.id);

    if (!existBanner) {
      return res.status(400).json({ message: "Ads Not Exist!!" }).end();
    }

    const existProperty = await Property.findById(req.params.property);

    if (!existProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    await Property.findByIdAndUpdate(existProperty._id, { $unset: { sideBarRef: "" } });


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
