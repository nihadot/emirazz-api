import NotificationModel from "../model/Notification.js";
import PropertyModel from "../model/Property.js";
import mongoose from "mongoose";
import { deleteFile } from "../middleware/deleteFile.js";
import Property from "../model/Property.js";
import { fetchCitiesAndCount } from "../helpers/fetchCitiesAndCount.js";
import { sortProjects } from "../helpers/sortProjects.js";
import { sortDateWise } from "../helpers/dateWiseSort.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";
    const newNotification = new NotificationModel({
      ...req.body,
      mainImgaeLink: mainImgaeLink,
    });
    const savedNotification = await newNotification.save();
    return res.status(200).json({ result: savedNotification }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getNotifications = await NotificationModel.find()

    const sortedDateWise = sortDateWise(getNotifications)

    return res.status(200).json({ result: sortedDateWise }).end();
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

    const existingNotification = await NotificationModel.findById(req.body._id);

    if (!existingNotification) {
      return res.status(400).json({ message: "Item Not Exist!!" }).end();
    }

    let obj = {
      ...req.body,
    };
    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      if (
        existingNotification?.mainImgaeLink &&
        existingNotification?.mainImgaeLink?.length > 0
      ) {
        const filename = existingNotification.mainImgaeLink;
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

    await NotificationModel.findByIdAndUpdate(
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

    const existingNotification = await NotificationModel.findById(req.params.id);

    if (!existingNotification) {
      return res.status(400).json({ message: "Item Not Exist!!" }).end();
    }

    await NotificationModel.findByIdAndDelete(req.params.id);

    if (
      existingNotification?.mainImgaeLink &&
      existingNotification?.mainImgaeLink?.length > 0
    ) {
      const filename = existingNotification.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        const response = await deleteFile(filePath);
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

























