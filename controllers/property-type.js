import mongoose from "mongoose";
import PropertyType from "../model/PropertyType.js";
import Property from "../model/Property.js";
import { deleteFile } from "../middleware/deleteFile.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";
    const newPropertyType = new PropertyType({
      ...req.body,
      mainImgaeLink: mainImgaeLink,
    });
    const savedPropertyType = await newPropertyType.save();
    return res.status(200).json({ result: savedPropertyType }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getProperties = await PropertyType.find();

    const properties = [];
    for (let propertyType of getProperties) {
      let counts = 0;
      const getProperties = await Property.countDocuments({
        propertyType: propertyType._id,
      });
      counts += getProperties;
      properties.push({ counts, propertyType });
    }
    return res.status(200).json({ result: properties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllPropertyType = async (req, res, next) => {
  try {
    const getProperties = await PropertyType.find();

  
    return res.status(200).json({ result: getProperties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const getById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "id not Provided" });
    }
    const getProperty = await PropertyType.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "cities",
          localField: "cityRef",
          foreignField: "_id",
          as: "cityInfo",
        },
      },
      {
        $unwind: "$cityInfo",
      },
    ]);
    return res.status(200).json({ result: getProperty }).end();
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

    const existAccount = await PropertyType.findById(req.body._id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    let obj = {
      ...req.body,
    };
    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      if (
        existAccount?.mainImgaeLink &&
        existAccount?.mainImgaeLink.length > 0
      ) {
        const filename = existAccount.mainImgaeLink;
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

    await PropertyType.findByIdAndUpdate(
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

    const existAccount = await PropertyType.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    

    const isExistingPropertyType = await Property.findOne({propertyType:new mongoose.Types.ObjectId(req.params.id)});

    if(isExistingPropertyType){
      return res.status(400).json({ message: "Already property avalible under the type" }).end();
    }

    

    await PropertyType.findByIdAndDelete(req.params.id);

    if (existAccount?.mainImgaeLink && existAccount.mainImgaeLink.length > 0) {
      const filename = existAccount.mainImgaeLink;
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

export const getCounts = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "id not Provided" });
    }
    const getProperty = await PropertyType.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "cities",
          localField: "cityRef",
          foreignField: "_id",
          as: "cityInfo",
        },
      },
      {
        $unwind: "$cityInfo",
      },
    ]);
    return res.status(200).json({ result: getProperty }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
