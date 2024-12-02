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

    console.log(req.body)
   
    const newNotification = new NotificationModel({
      ...req.body });
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
    const notifications = await NotificationModel.aggregate([
      // Perform a conditional lookup for `propertyDetails` only if `project` exists
      {
        $addFields: {
          projectExists: { $cond: { if: { $ifNull: ["$project", false] }, then: true, else: false } },
        },
      },
      {
        $lookup: {
          from: "properties",
          let: { projectId: "$project", projectExists: "$projectExists" },
          pipeline: [
            { $match: { $expr: { $and: ["$$projectExists", { $eq: ["$_id", { $toObjectId: "$$projectId" }] }] } } },
            {
              $set: {
                cities: {
                  $map: {
                    input: "$cities",
                    as: "cityId",
                    in: { $toObjectId: "$$cityId" },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "cities",
                localField: "cities",
                foreignField: "_id",
                as: "cityDetails",
              },
            },
            {
              $set: {
                developer: { $toObjectId: "$developer" },
              },
            },
            {
              $lookup: {
                from: "developers",
                localField: "developer",
                foreignField: "_id",
                as: "developerDetails",
              },
            },
            { $unwind: { path: "$developerDetails", preserveNullAndEmptyArrays: true } },
            {
              $set: {
                adsOptions: {
                  $cond: {
                    if: { $not: "$adsOptions" },
                    then: null,
                    else: { $toObjectId: "$adsOptions" },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "sidebannerlogos",
                localField: "adsOptions",
                foreignField: "_id",
                as: "adsDetails",
              },
            },
            { $unwind: { path: "$adsDetails", preserveNullAndEmptyArrays: true } },
          ],
          as: "propertyDetails",
        },
      },
      {
        $set: {
          propertyDetails: { $arrayElemAt: ["$propertyDetails", 0] }, // Flatten `propertyDetails` array to an object
        },
      },
      {
        $unset: "projectExists", // Remove temporary field
      },
    ]);
    const sortedDateWise = sortDateWise(notifications)

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

  
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingNotification = await NotificationModel.findById(req.params.id);

    if (!existingNotification) {
      return res.status(400).json({ message: "Item Not Exist!!" }).end();
    }

    await NotificationModel.findByIdAndUpdate(
      req.params.id,
      { $set:  req.body  },
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


export const getNotificationById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
    const getNotification = await NotificationModel.findById(req.params.id);
    return res.status(200).json({ result: getNotification }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
























