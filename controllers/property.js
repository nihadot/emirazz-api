import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PropertyModel from "../model/Property.js";
import Enquiry from "../model/Enquiry.js";

export const create = async (req, res, next) => {
  try {
    const newProperty = new PropertyModel(req.body);
    const savedProperty = await newProperty.save();
    return res.status(200).json({ result: savedProperty }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {

  console.log(req.query)
  try {
    const pipeline = [];

// Match propertyType if the query parameter is provided
if (req.query.propertyType) {
  pipeline.push({
    $match: {
      propertyType: {
        $elemMatch: { $eq: req.query.propertyType }
      }
    }
  });
}

// Add other stages of your pipeline
pipeline.push(
  {
    $lookup: {
      from: "developers",
      localField: "developerRef",
      foreignField: "_id",
      as: "developerName"
    }
  },
  {
    $lookup: {
      from: "cities",
      localField: "cityRef",
      foreignField: "_id",
      as: "cityName"
    }
  },
  {
    $unwind: "$developerName"
  },
  {
    $unwind: "$cityName"
  },
  {
    $addFields: {
      developerName: "$developerName.developerName"
    }
  },
  {
    $addFields: {
      cityName: "$cityName.cityName"
    }
  }
);

// Execute the pipeline
const getProperties = await PropertyModel.aggregate(pipeline);
    return res.status(200).json({ result: getProperties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    console.log(req.body)
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.body._id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    await PropertyModel.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    const existAccount = await PropertyModel.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    await PropertyModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const saveEnquiry = await newEnquiry.save();
    return res.status(200).json({ result: saveEnquiry }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getEnquiry = async (req, res, next) => {
  try {
    const newEnquiry = await Enquiry.aggregate([
      {
        $lookup:{
          from:"properties",
          localField:"propertyId",
          foreignField:"_id",
          as:"propertyInfo"
        }
      },
      {
        $unwind:"$propertyInfo"
      }
    ]);
    return res.status(200).json({ result: newEnquiry }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

