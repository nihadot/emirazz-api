import mongoose from "mongoose";
import { deleteFile } from "../middleware/deleteFile.js";
import SideBannerLogo from "../model/SideBanner.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";

    const newSideBar = new SideBannerLogo({
      mainImgaeLink: mainImgaeLink,
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

    return res.status(200).json({ result: getAllSideBanners }).end();
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
