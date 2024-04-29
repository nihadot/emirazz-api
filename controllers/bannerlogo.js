import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BannerLogo from "../model/BannerLogo.js";
import { deleteFile } from "../middleware/deleteFile.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
    ? req.files.mainImgaeLink[0].filename
    : "";
    const newBanner = new BannerLogo({mainImgaeLink:mainImgaeLink});
    const savedBanner = await newBanner.save();
    return res.status(200).json({ result: savedBanner }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getBannerLogos = await BannerLogo.find();

    return res.status(200).json({ result: getBannerLogos }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBanner = await BannerLogo.findById(req.body._id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner logo Not Exist!!" }).end();
    }
    let obj = {
      ...req.body,
    };

    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      const filename = existingBanner.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        await deleteFile(filePath);
      } catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }
    }

    await BannerLogo.findByIdAndUpdate(req.body._id, { $set: { ...obj } },{new:true});

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

    const existingBannerLogo = await BannerLogo.findById(req.params.id);

    if (!existingBannerLogo) {
      return res.status(400).json({ message: "Banner logo Not Exist!!" }).end();
    }

    await BannerLogo.findByIdAndDelete(req.params.id);

    if(existingBannerLogo?.mainImgaeLink){
      const filename = existingBannerLogo.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        const response = await deleteFile(filePath);
        console.log(response)
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