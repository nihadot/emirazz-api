import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlogModel from "../model/Blog.js";
import { deleteFile } from "../middleware/deleteFile.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";
    const newBlog = new BlogModel({
      ...req.body,
      mainImgaeLink: mainImgaeLink,
    });
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
    if (!req.params.id)
      return res.status(400).json({ message: "Id not Provided" });
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

    let obj = {
      ...req.body,
    };
    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      const filename = existingBlog.mainImgaeLink;
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
    await BlogModel.findByIdAndUpdate(
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

    const existingBlog = await BlogModel.findById(req.params.id);

    if (!existingBlog) {
      return res.status(400).json({ message: "Blog Not Exist!!" }).end();
    }

    await BlogModel.findByIdAndDelete(req.params.id);

    if (existingBlog?.mainImgaeLink) {
      const filename = existingBlog.mainImgaeLink;
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
