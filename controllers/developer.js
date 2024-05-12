import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeveloperModel from "../model/Developer.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Property from "../model/Property.js";
import mongoose from "mongoose";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";
    const newDeveloper = new DeveloperModel({
      ...req.body,
      mainImgaeLink: mainImgaeLink,
    });
    const savedDeveloper = await newDeveloper.save();
    return res.status(200).json({ result: savedDeveloper }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getDevelopers = await DeveloperModel.find();

    return res.status(200).json({ result: getDevelopers }).end();
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

    const existingDeveloper = await DeveloperModel.findById(req.body._id);

    if (!existingDeveloper) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    let obj = {
      ...req.body,
    };

    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
    if(existingDeveloper?.mainImgaeLink && existingDeveloper?.mainImgaeLink?.length > 0){
      const filename = existingDeveloper.mainImgaeLink;
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
    }

    await DeveloperModel.findByIdAndUpdate(
      req.body._id,
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

    const existingDeveloper = await DeveloperModel.findById(req.params.id);

    if (!existingDeveloper) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    const isExistingDeveloper = await Property.findOne({developerRef:new mongoose.Types.ObjectId(req.params.id)});

    if(isExistingDeveloper){
      return res.status(400).json({ message: "Already property avalible under the developer" }).end();
    }

    await DeveloperModel.findByIdAndDelete(req.params.id);

    if (existingDeveloper?.mainImgaeLink && existingDeveloper?.mainImgaeLink.length > 0) {
      const filename = existingDeveloper.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        const response = await deleteFile(filePath);
        console.log(response);
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
