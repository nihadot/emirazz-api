import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlogModel from "../model/Blog.js";

export const create = async (req, res, next) => {
  try {
    const newBlog = new BlogModel(req.body);
    const savedBlog = await newBlog.save();
    return res.status(200).json({ result: savedBlog }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getBlogs = await BlogModel.find();

    return res.status(200).json({ result: getBlogs }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const getById = async (req, res, next) => {
  try {
    if(!req.params.id) return res.status(400).json({message:"Id not Provided"})
    const getBlog = await BlogModel.findById(req.params.id);

    return res.status(200).json({ result: getBlog }).end();
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

    const existingBlog = await BlogModel.findById(req.body._id);

    if (!existingBlog) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    await BlogModel.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    const existingBlog = await BlogModel.findById(req.params.id);

    if (!existingBlog) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    await BlogModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};