import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PropertyModel from "../model/Property.js";
import Enquiry from "../model/Enquiry.js";
import mongoose from "mongoose";
import Property from "../model/Property.js";
import PropertyType from "../model/PropertyType.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Developer from "../model/Developer.js";

export const create = async (req, res, next) => {
  try {
    const { propertyType, facilities, paymentPlan, areasNearBy, smallImage } =
      req.body;

    let propertyTypeVariable;
    let facilitiesVariable;
    let areasNearByVariable;
    let paymentPlanByVariable;
    let smallImageVariable;

    if (propertyType) {
      propertyTypeVariable = JSON.parse(req.body.propertyType);
    }
    if (facilities) {
      facilitiesVariable = JSON.parse(req.body.facilities);
    }
    if (paymentPlan) {
      paymentPlanByVariable = JSON.parse(req.body.paymentPlan);
    }
    if (areasNearBy) {
      areasNearByVariable = JSON.parse(req.body.areasNearBy);
    }
    if (smallImage) {
      smallImageVariable = JSON.parse(req.body.smallImage);
    }

    if (req.body.propertyType) {
      delete req.body.propertyType;
    }
    if (req.body.facilities) {
      delete req.body.facilities;
    }
    if (req.body.paymentPlan) {
      delete req.body.paymentPlan;
    }
    if (req.body.areasNearBy) {
      delete req.body.areasNearBy;
    }
    if (req.body.smallImage) {
      delete req.body.smallImage;
    }
    if (!req.body.sideBarRef) {
      delete req.body.sideBarRef;
    }
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";

    let ArraysmallImage = [];

    if (req.files.smallImage && req.files.smallImage.length > 0) {
      Array.from(req.files.smallImage).forEach((item) =>
        ArraysmallImage.push(item.filename)
      );
    }

    const newProperty = new PropertyModel({
      ...req.body,
      propertyType: propertyTypeVariable,
      facilities: facilitiesVariable,
      areasNearBy: areasNearByVariable,
      paymentPlan: paymentPlanByVariable,
      smallImage: ArraysmallImage,
      mainImgaeLink: mainImgaeLink,
    });

    const savedProperty = await newProperty.save();
    return res.status(200).json({ result: savedProperty }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const addEnq = async (req, res, next) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const savedEnquiry = await newEnquiry.save();
    return res.status(200).json({ result: savedEnquiry }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pipeline = [];
    // Match propertyType if the query parameter is provided
    if (Boolean(req.query.propertyType && req.query.propertyTypeId)) {
      pipeline.push({
        $match: {
          propertyType: {
            $in: [new mongoose.Types.ObjectId(req.query.propertyTypeId)], // Use $in to match elements inside the array
          },
        },
      });
    }

    if (Boolean(req.query.developer)) {
      pipeline.push({
        $match: {
          developerRef: new mongoose.Types.ObjectId(req.query.developer),
        },
      });
    }

    if (Boolean(req.query.cities)) {
      pipeline.push({
        $match: {
          cityRef: new mongoose.Types.ObjectId(req.query.cities),
        },
      });
    }

    // Add other stages of your pipeline
    pipeline.push(
      {
        $lookup: {
          from: "developers",
          localField: "developerRef",
          foreignField: "_id",
          as: "developerName",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "cityRef",
          foreignField: "_id",
          as: "cityName",
        },
      },
      {
        $unwind: "$developerName",
      },
      {
        $unwind: "$cityName",
      },
      {
        $addFields: {
          developerName: "$developerName.developerName",
        },
      },
      {
        $addFields: {
          cityName: "$cityName.cityName",
        },
      }
    );

    const getProperties = await PropertyModel.aggregate(pipeline);

    const allProperties = [];
    for (let property of getProperties) {
      if (property?.propertyType?.length > 0) {
        const propertyInfo = [];
        for (let propertyId of property?.propertyType) {
          const propertyInfoData = await PropertyType.findById(propertyId);
          propertyInfo.push(propertyInfoData);
        }
        allProperties.push({ ...property, propertyType: propertyInfo });
      }
    }

    return res.status(200).json({ result: allProperties }).end();
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
    const getProperty = await PropertyModel.aggregate([
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

    const properties = [];
    for (let property of getProperty) {
      const propertyArray = [];
      if (property?.propertyType.length > 0) {
        for (let propertyId of property?.propertyType) {
          const propertyInfo = await PropertyType.findById(propertyId);
          propertyArray.push(propertyInfo);
        }
      }
      properties.push({ ...property, propertyType: propertyArray });
    }
    return res.status(200).json({ result: properties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    // --------------------------
    const { propertyType, facilities, paymentPlan, areasNearBy, smallImage } =
      req.body;

    let propertyTypeVariable;
    let facilitiesVariable;
    let areasNearByVariable;
    let paymentPlanByVariable;
    let smallImageVariable;

    if (propertyType) {
      propertyTypeVariable = JSON.parse(req.body.propertyType);
    }
    if (facilities) {
      facilitiesVariable = JSON.parse(req.body.facilities);
    }
    if (paymentPlan) {
      paymentPlanByVariable = JSON.parse(req.body.paymentPlan);
    }
    if (areasNearBy) {
      areasNearByVariable = JSON.parse(req.body.areasNearBy);
    }
    if (smallImage) {
      smallImageVariable = JSON.parse(req.body.smallImage);
    }

    if (req.body.propertyType) {
      delete req.body.propertyType;
    }
    if (req.body.facilities) {
      delete req.body.facilities;
    }
    if (req.body.paymentPlan) {
      delete req.body.paymentPlan;
    }
    if (req.body.areasNearBy) {
      delete req.body.areasNearBy;
    }
    if (req.body.smallImage) {
      delete req.body.smallImage;
    }

    const obj = {
      ...req.body,
      // smallImage: smallImageVariable,
    };

    if (propertyTypeVariable && propertyTypeVariable.length > 0) {
      obj.propertyType = propertyTypeVariable;
    }
    if (facilitiesVariable && facilitiesVariable.length > 0) {
      obj.facilities = facilitiesVariable;
    }
    if (areasNearByVariable && areasNearByVariable.length > 0) {
      obj.areasNearBy = areasNearByVariable;
    }
    if (paymentPlanByVariable && paymentPlanByVariable.length > 0) {
      obj.paymentPlan = paymentPlanByVariable;
    }
    // if (paymentPlanByVariable && paymentPlanByVariable.length > 0) {
    //   obj.mainImgaeLink = req.files.mainImgaeLink;
    // }

    // --------------
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.body._id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      if (existAccount.mainImgaeLink.length > 0) {
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

    // if (req.files.smallImage) {
    //   obj.smallImage = req.files.smallImage[0].filename;
    //   if (existAccount.mainImgaeLink.length > 0) {
    //     const filename = existAccount.mainImgaeLink;
    //     const filePath = `/mainImage/${filename}`;
    //     try {
    //       await deleteFile(filePath);
    //     } catch (error) {
    //       return res
    //         .status(400)
    //         .json({ message: error.message || "Internal server error!" })
    //         .end();
    //     }
    //   }
    // }

    let ArraysmallImage = [];

    if (req.files.smallImage && req.files.smallImage.length > 0) {
      Array.from(req.files.smallImage).forEach((item) =>
        ArraysmallImage.push(item.filename)
      );
    }

    await PropertyModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          ...obj,
        },
      },
      { new: true }
    );

    if (ArraysmallImage.length > 0) {
      const result = await PropertyModel.findById(req.body._id);
      result.smallImage.push(...ArraysmallImage);
      await result.save();
    }

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await Enquiry.findById(req.body.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    await Enquiry.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          status: req.body.status,
        },
      },
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
export const updateAdsStatus = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await Property.findById(req.body.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    await Property.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          isAds: req.body.status,
        },
      },
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

    const existAccount = await PropertyModel.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    await PropertyModel.findByIdAndDelete(req.params.id);

    if (existAccount?.smallImage) {
      for (let file of existAccount?.smallImage) {
        const filePath = `/smallImage/${file}`;
        if (file) {
          const response = await deleteFile(filePath);
        }
      }
    }

    if (existAccount?.mainImgaeLink) {
      const filePath = `/mainImage/${existAccount?.mainImgaeLink}`;
      const response = await deleteFile(filePath);
    }

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
    const newEnquiry = await Enquiry.find();

    const newArray = [];

    for (let item of newEnquiry) {
      if (item) {
        const getProperty = await PropertyModel.findById(item.propertyId);
        const getDeveloper = await Developer.findById(item.developerId);
        if (getProperty && getDeveloper) {
          newArray.push({
            ...item._doc,
            propertyName: getProperty.propretyHeadline,
            developerName: getDeveloper.developerName,
          });
        }
      }
    }

    return res.status(200).json({ result: newArray }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getCounts = async (req, res, next) => {
  try {
    const obj = {};
    const newTownhouse = await PropertyModel.countDocuments({
      propertyType: "townhouse",
    });
    const newApartment = await PropertyModel.countDocuments({
      propertyType: "apartment",
    });
    const newPenthouse = await PropertyModel.countDocuments({
      propertyType: "penthouse",
    });
    const newVilla = await PropertyModel.countDocuments({
      propertyType: "villa",
    });

    obj.townhouse = newTownhouse;
    obj.apartment = newApartment;
    obj.penthouse = newPenthouse;
    obj.villa = newVilla;
    return res.status(200).json({ result: obj }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteSmallImage = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    const response = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { smallImage: req.body.smallImage },
      },
      { new: true }
    );
    const filePath = `/smallImage/${req.body.smallImage}`;
    try {
      const response = await deleteFile(filePath);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || "Internal server error!" })
        .end();
    }

    return res
      .status(200)
      .json({ message: "Successfully Deleted", result: response })
      .end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getSearchProperty = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;

    // Ensure searchQuery is sanitized and valid
    if (!searchQuery) {
      return res.status(400).json({ message: "Invalid search query" });
    }

    if (searchQuery) {
      const getProperties = await PropertyModel.findOne({
        projectNo: req.query.q,
      });

      if (!getProperties) {
        const getProperties = await PropertyModel.findOne({
          projectNo: "#" + req.query.q,
        });
        if (!getProperties) {
          return res.status(404).json({ message: "No properties found" });
        }

        return res.status(200).json({ result: getProperties });
      }
      return res.status(200).json({ result: getProperties });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
