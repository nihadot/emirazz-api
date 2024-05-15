import mongoose from "mongoose";
import { deleteFile } from "../middleware/deleteFile.js";
import SideBannerLogo from "../model/SideBanner.js";
import Property from "../model/Property.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";

    const newSideBar = new SideBannerLogo({
      mainImgaeLink: mainImgaeLink,
      ...req.body,
    });

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


    const getAllPropertes = await Property.find();

    let newResultArray = []

    
    for (let item of getAllPropertes) {
      if (item.sideBarRef) {
        const result =  getAllSideBanners.find((itm) =>itm._id+'' === item.sideBarRef+'') 

        if(result){
          newResultArray.push({property:item,...result._doc}) 
        }
      }
    }



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
      sideBarRef: new mongoose.Types.ObjectId(req.params.id),
    });

    if (existProperty) {
      return res
        .status(400)
        .json({ message: "Property exist under the Ads!!" })
        .end();
    }

    await SideBannerLogo.findByIdAndDelete(req.params.id);

    if (existBanner?.mainImgaeLink && existBanner?.mainImgaeLink.length > 0) {
      const filePath = `/mainImage/${existBanner?.mainImgaeLink}`;
      const response = await deleteFile(filePath);
    }

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
    const getAllResponse = await Property.find();
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
