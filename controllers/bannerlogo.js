import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BannerLogo from "../model/BannerLogo.js";

export const create = async (req, res, next) => {
  try {
    const newBanner = new BannerLogo(req.body);
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

    await BannerLogo.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};