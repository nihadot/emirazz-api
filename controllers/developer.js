import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeveloperModel from "../model/Developer.js";

export const create = async (req, res, next) => {
  try {
    const newDeveloper = new DeveloperModel(req.body);
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

    await DeveloperModel.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    await DeveloperModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};