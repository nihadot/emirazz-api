import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CityModel from "../model/City.js";
import PropertyModel from "../model/Property.js";
import mongoose from "mongoose";

export const create = async (req, res, next) => {
  try {
    const newCity = new CityModel(req.body);
    const savedCity = await newCity.save();
    return res.status(200).json({ result: savedCity }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getCties = await CityModel.find();
    let arr = [];
    for (let city of getCties) {
      if (city) {
        const getCtiesCount = await PropertyModel.countDocuments({
          cityRef: new mongoose.Types.ObjectId(city._id),
        });
        arr.push({ ...city._doc, count: getCtiesCount });
      }
    }

    return res.status(200).json({ result: arr }).end();
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

    const existingCity = await CityModel.findById(req.body._id);

    if (!existingCity) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    await CityModel.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    const existingCity = await CityModel.findById(req.params.id);

    if (!existingCity) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    await CityModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
