import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeveloperModel, { addDeveloperSchema } from "../model/Developer.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Property from "../model/Property.js";
import mongoose from "mongoose";
import { sortProjects } from "../helpers/sortProjects.js";

export const create = async (req, res, next) => {
  try {
    const { error, value } = addDeveloperSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    if(value.priority){
      value.priorityExists = true;
     }

     console.log(value,'value')
    const newDeveloper = new DeveloperModel(value);
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

    const sortedDevelopers = sortProjects(getDevelopers);

    return res.status(200).json({ result: sortedDevelopers }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const getDeveloperById = async (req, res, next) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const getDeveloper = await DeveloperModel.find(req.params.id);

    return res.status(200).json({ result: getDeveloper }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const editById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingDeveloper = await DeveloperModel.findById(req.params.id);

    if (!existingDeveloper) {
      return res.status(400).json({ message: "Developer Not Exist!!" }).end();
    }
    console.log(req.body,'-req.body')

    let data = {
      developerName: req.body.developerName,
        password: req.body.password,
        username: req.body.username,
    };
    if(req.body.priority){
      data.priorityExists = true;
      data.priority = req.body.priority;
    }else{
      data.priorityExists = false;
      data.priority = null;
    }
    const toCOnvertString = Object.keys(req.body.imageFile).length > 0 && true;

    if(toCOnvertString){
      data.imageFile = req.body.imageFile;
    }


    await DeveloperModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...data } },
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

    const isExistingDeveloper = await Property.findOne({developer:new mongoose.Types.ObjectId(req.params.id)});

    if(isExistingDeveloper){
      return res.status(400).json({ message: "Already property available under the developer" }).end();
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
