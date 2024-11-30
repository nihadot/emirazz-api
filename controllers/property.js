import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PropertyModel from "../model/Property.js";
import Enquiry from "../model/Enquiry.js";
import mongoose from "mongoose";
import Property from "../model/Property.js";
import PropertyType from "../model/PropertyType.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Developer from "../model/Developer.js";
import { fetchProjectsByDeveloper } from "../helpers/fetchProjectsByDeveloper.js";
import { fetchProjectsByPropertyType } from "../helpers/fetchProjectsByPropertyType.js";
import { fetchProjectsByCity } from "../helpers/fetchProjectsByCity.js";
import { sortProjects } from "../helpers/sortProjects.js";
import Notification from "../model/Notification.js";
import AssignedModel from "../model/AssigendProjects.js";
import Agency from "../model/Agency.js";
import City from "../model/City.js";

import Joi from "joi";

// Validation schema for required fields
const addingProject = Joi.object({
  projectTitle: Joi.string().min(3).max(250).required(), // Title must be between 3-100 characters
  priceInAED: Joi.string().required(), // Ensure price is numeric (as string)
  handoverDate: Joi.date().iso().required(), // ISO date format
  beds: Joi.string().required(), // Ensure beds are numeric (as string)
  propertyType: Joi.array().items(Joi.string()).min(1).required(), // At least one property type
  cities: Joi.array().items(Joi.string()).min(1).required(),
  developer: Joi.string().required(), // MongoDB ObjectID validation
  imageFile: Joi.object().required(), // Image file is required,
  address:Joi.string().allow(''),
  adsOptions: Joi.string().allow(''), //
  description: Joi.string().allow(''), //
  draft:Joi.boolean().allow(''), //
  facilities : Joi.array().allow(''), //
  imageFiles : Joi.array().allow(''), //
  isChecked : Joi.boolean().allow(''), //
  mapLink : Joi.string().allow(''), //
  nearbyAreas : Joi.array().allow(''),
  paymentOptions: Joi.array().allow(''),
  priority: Joi.number().allow(''), //
  projectVideo: Joi.string().allow(''),
  projectNumber : Joi.string().allow(''),
  // adsOptions: Joi.string().required(), // MongoDB ObjectID validation
  projectMetaDescription:Joi.string().allow(''),
  projectMetaTitle:Joi.string().allow(''),
  projectMetaKeywords:Joi.string().allow(''),
});


export const create = async (req, res, next) => {
  try {

  
      // Validate request body
      const { error, value } = addingProject.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          message: "Validation error " + error.details.map((err) => err.message),
        });
      }


    const isExist = new PropertyModel({projectTitle: req.body.projectTitle});

      if(isExist){
        return res.status(400).json({ message: "Project title already exists" }).end();
      }

      if(value.priority){
        value.priorityExists = true;
       }
    
    const newProperty = new PropertyModel(value);

    // if(!req.body.developer){
    //   return res.status(200).json({ message: 'Developer not found' });
    // }
    // const isExistDeveloper = await Developer.findById(req.body.developer);

    // if(!isExistDeveloper){
    //   return res.status(400).json({ message: "Developer not found" }).end();
    // }


    // const newNotification = new Notification({
    //   title:`New project launched by ${isExistDeveloper?.developerName} Starting From ${req.body.priceInAED}`,
    //   imageFile:req.body.imageFile
    // })

    const savedProperty = await newProperty.save();
    // const savedNotification = await newNotification.save();
    
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

    console.log(req.query)

    let isSold = false
    let draft = false
    let search = req.query.search;

    if(req.query.issold === 'true'){
       isSold = true
    }


    if(req.query.draft === 'true'){
      draft = true
   }
    const page = parseInt(req.query.page) || 1;
    const limit = 100; 

    const matchConditions = {
      isSold: isSold,
      draft: draft,
    };

    if (search) {
      matchConditions.projectTitle = search;
    }

  
    // const items = await PropertyModel.find({isSold:isSold}).skip((page - 1) * limit).limit(limit);

    const items = await PropertyModel.aggregate([
      {
        $match: matchConditions, // Combine all match conditions
      },
      {
        $set: {
          cities: {
            $map: {
              input: "$cities", // The array of string IDs
              as: "cityId",     // Temporary variable for each element
              in: { $toObjectId: "$$cityId" } // Convert each string to ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: "cities", // Name of the related collection
          localField: "cities", // The converted ObjectId array
          foreignField: "_id", // Field in the `cities` collection to match
          as: "cityDetails" // Output array with matched documents
        }
      },
      {
        $set: {
          developer: { $toObjectId: "$developer" } // Convert the `developer` string to ObjectId
        }
      },
      {
        $lookup: {
          from: "developers", // Name of the related collection
          localField: "developer", // The converted ObjectId
          foreignField: "_id", // Field in the `developers` collection to match
          as: "developerDetails" // Output array with matched documents
        }
      },
      {
        $unwind: "$developerDetails" // Ensure developer details are a single object
      },
      {
        $set: {
          adsOptions: { $cond: { if: { $not: "$adsOptions" }, then: null, else: { $toObjectId: "$adsOptions" } } } // Convert the `adsOptions` string to ObjectId if present
        }
      },
      
      {
        $lookup: {
          from: "sidebannerlogos", // Name of the related collection
          localField: "adsOptions", // The converted ObjectId
          foreignField: "_id", // Field in the `sidebannerlogos` collection to match
          as: "adsDetails" // Output array with matched documents
        }
      },
      {
        $unwind: {
          path: "$adsDetails",
          preserveNullAndEmptyArrays: true // Include documents without adsDetails
        }
      }
    ]).skip((page - 1) * limit).limit(limit);
    

    // const projectsWithPropertyType = await fetchProjectsByPropertyType(items,true);
    // const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    // const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);


    
    
    const sortedProjects = sortProjects(items);
    // console.log(sortedProjects,'sortedProjects')
    return res.status(200).json({ result: sortedProjects });


  }catch (error) {
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
  


    const items = await PropertyModel.aggregate([
      {
        $match:{
          _id: new mongoose.Types.ObjectId(req.params.id),
        }
      },
  
      {
        $set: {
          cities: {
            $map: {
              input: "$cities", // The array of string IDs
              as: "cityId",     // Temporary variable for each element
              in: { $toObjectId: "$$cityId" } // Convert each string to ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: "cities", // Name of the related collection
          localField: "cities", // The converted ObjectId array
          foreignField: "_id", // Field in the `cities` collection to match
          as: "cityDetails" // Output array with matched documents
        }
      },
      {
        $set: {
          developer: { $toObjectId: "$developer" } // Convert the `developer` string to ObjectId
        }
      },
      {
        $lookup: {
          from: "developers", // Name of the related collection
          localField: "developer", // The converted ObjectId
          foreignField: "_id", // Field in the `developers` collection to match
          as: "developerDetails" // Output array with matched documents
        }
      },
      {
        $unwind: "$developerDetails" // Ensure developer details are a single object
      },
      {
        $set: {
          adsOptions: { $cond: { if: { $not: "$adsOptions" }, then: null, else: { $toObjectId: "$adsOptions" } } } // Convert the `adsOptions` string to ObjectId if present
        }
      },
      {
        $lookup: {
          from: "sidebannerlogos", // Name of the related collection
          localField: "adsOptions", // The converted ObjectId
          foreignField: "_id", // Field in the `sidebannerlogos` collection to match
          as: "adsDetails" // Output array with matched documents
        }
      },
      {
        $unwind: {
          path: "$adsDetails",
          preserveNullAndEmptyArrays: true // Include documents without adsDetails
        }
      }
    ])
    


    return res.status(200).json({ result: items }).end();
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
    const { propertyType,citiesArrayRef,facilities, paymentPlan, areasNearBy, smallImage } =
      req.body;

    let propertyTypeVariable;
    let facilitiesVariable;
    let areasNearByVariable;
    let paymentPlanByVariable;
    let smallImageVariable;
    let citiesArrayRefVariable;


    if (propertyType) {
      propertyTypeVariable = JSON.parse(req.body.propertyType);
    }
    if (citiesArrayRef) {
      citiesArrayRefVariable = JSON.parse(req.body.citiesArrayRef);
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
    if(req.body.citiesArrayRefVariable){
      delete req.body.citiesArrayRef;
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
    if (citiesArrayRefVariable && citiesArrayRefVariable.length > 0) {
      obj.citiesArrayRef = citiesArrayRefVariable;
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
    console.log(req.body,'created')

    if(!req.body.name || !req.body.number || !req.body.propertyId){
      return res.status(400).json({ message: "All fields are required!" }).end();
    }


    const IsProperty = await PropertyModel.findById(req.body.propertyId);

    if(!IsProperty){
      return res.status(400).json({ message: "Property Not Found!" }).end();
    }

    const obj = {
      name: req.body.name,
      number: req.body.number,
      // projectId: req.body.projectId,
      propertyId: req.body.propertyId,
      developerId: IsProperty.developer+''
    }

    console.log(obj,'obj')
    const newEnquiry = new Enquiry(obj);
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

    // const items = await Enquiry.aggregate([
    //   {
    //     $set: {
    //       developerId: { $toObjectId: "$developerId" } // Convert the `developer` string to ObjectId
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "developers", // Name of the related collection
    //       localField: "developer", // The converted ObjectId
    //       foreignField: "_id", // Field in the `developers` collection to match
    //       as: "developerDetails" // Output array with matched documents
    //     }
    //   },
    //   {
    //     $unwind: "$developerDetails" // Ensure developer details are a single object
    //   },
    //   {
    //     $set: {
    //       developerDetails: { $cond: { if: { $not: "$developerDetails" }, then: null, else: { $toObjectId: "$developerDetails" } } } // Convert the `adsOptions` string to ObjectId if present
    //     }
    //   },
     


    //   {
    //     $set: {
    //       propertyId: { $toObjectId: "$propertyId" } // Convert the `developer` string to ObjectId
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "properties", // Name of the related collection
    //       localField: "propertyId", // The converted ObjectId
    //       foreignField: "_id", // Field in the `developers` collection to match
    //       as: "propertyDetails" // Output array with matched documents
    //     }
    //   },
    //   {
    //     $unwind: "$propertyDetails" // Ensure developer details are a single object
    //   },
    //   {
    //     $set: {
    //       propertyId: { $cond: { if: { $not: "$propertyId" }, then: null, else: { $toObjectId: "$propertyId" } } } // Convert the `adsOptions` string to ObjectId if present
    //     }
    //   },
     
    // ])


    // const items = await Enquiry.find(
    //   {
    //     $set: {
    //       developerId: { $toObjectId: "$developerId" } // Convert the `developer` string to ObjectId
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "developers", // Name of the related collection
    //       localField: "developerId", // The converted ObjectId
    //       foreignField: "_id", // Field in the `developers` collection to match
    //       as: "developerDetails" // Output array with matched documents
    //     }
    //   },
    //   {
    //     $unwind: "$developerDetails" // Ensure developer details are a single object
    //   },



    //   {
    //     $set: {
    //       propertyId: { $toObjectId: "$propertyId" } // Convert the `developer` string to ObjectId
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "properties", // Name of the related collection
    //       localField: "propertyId", // The converted ObjectId
    //       foreignField: "_id", // Field in the `developers` collection to match
    //       as: "propertyDetails" // Output array with matched documents
    //     }
    //   },
    //   {
    //     $unwind: "$propertyDetails" // Ensure developer details are a single object
    //   },
    
     
    // )



    

    const items = await Enquiry.aggregate([
      {
        $set: {
          developerId: { $toObjectId: "$developerId" },
          propertyId: { $toObjectId: "$propertyId" }
        }
      },
      {
        $lookup: {
          from: "developers",
          localField: "developerId",
          foreignField: "_id",
          as: "developerDetails"
        }
      },
      {
        $unwind: "$developerDetails"
      },
      {
        $lookup: {
          from: "properties",
          localField: "propertyId",
          foreignField: "_id",
          as: "propertyDetails"
        }
      },
      {
        $unwind: "$propertyDetails"
      }
    ]);


    for (const element of items) {
      console.log(element, 'element');
    
      if (element.assignedTo) {
        const assignedRecord = await AssignedModel.findById(element.assignedTo).lean();
    
        if (assignedRecord?.agencyId) {
          const agencyRecord = await Agency.findById(assignedRecord.agencyId).lean();
    
          if (agencyRecord?.name) {
            element.assignedToName = agencyRecord.name;
          }
        }
      }
    }

    // console.log(items,'items')


      // {
      //   $lookup: {
      //     from: "assignedprojects",
      //     localField: "assignedTo",
      //     foreignField: "_id",
      //     as: "assignedDetails"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$assignedDetails",
      //     preserveNullAndEmptyArrays: true
      //   }
      // }

    // const { ObjectId } = require("mongodb"); // Import ObjectId to use later if needed

// const items = await Enquiry.aggregate([
//   {
//     $set: {
//       developerId: { $toObjectId: "$developerId" },
//       propertyId: { $toObjectId: "$propertyId" }
//     }
//   },
//   {
//     $lookup: {
//       from: "developers",
//       localField: "developerId",
//       foreignField: "_id",
//       as: "developerDetails"
//     }
//   },
//   {
//     $unwind: "$developerDetails"
//   },
//   {
//     $lookup: {
//       from: "properties",
//       localField: "propertyId",
//       foreignField: "_id",
//       as: "propertyDetails"
//     }
//   },
//   {
//     $unwind: "$propertyDetails"
//   },
//   {
//     $match: {
//       assignedTo: { $exists: true, $type: "string", $regex: /^[a-f\d]{24}$/i }
//       // Ensures `assignedTo` exists, is a string, and matches ObjectId format
//     }
//   },
//   {
//     $set: {
//       assignedTo: { $toObjectId: "$assignedTo" } // Convert the valid string to ObjectId
//     }
//   },
//   {
//     $lookup: {
//       from: "assignedprojects",
//       localField: "assignedTo",
//       foreignField: "_id",
//       as: "assignedDetails"
//     }
//   },
//   {
//     $unwind: {
//       path: "$assignedDetails",
//       preserveNullAndEmptyArrays: true // In case you still want to include non-matching documents
//     }
//   }
// ]);


      // {
      //   $lookup: {
      //     from: "assignedprojects", // Name of the related collection
      //     localField: "assignedTo", // The converted ObjectId
      //     foreignField: "_id", // Field in the `developers` collection to match
      //     as: "assignedDetails" // Output array with matched documents
      //   }
      // },
      // {
      //   $unwind: "$assignedDetails" // Ensure developer details are a single object
      // },

    return res.status(200).json({ result: items }).end();
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

// export const getSearchProperty = async (req, res, next) => {
//   try {

//     const searchQuery = req.query.q;

//     // Ensure searchQuery is sanitized and valid
//     if (!searchQuery) {
//       return res.status(400).json({ message: "Invalid search query" });
//     }

//     const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex


//       const getProperties = await PropertyModel.find({
//         $or:[
//           { propretyHeadline:regex },
//           {price:regex},
//           {beds:searchQuery},
//           {address:regex},
//           {description:regex},
//           {areasNearBy:{$in:[regex]}},
//           {handoverDate:{$gte:new Date(searchQuery)}},
//         ]
//       })

//       return res.status(200).json({ result: getProperties });

//   } catch (error) {
//     return res
//       .status(400)
//       .json({ message: error.message || "Internal server error!" })
//       .end();
//   }
// };



export const getSearchProperty = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;

    // Ensure searchQuery is sanitized and valid
    console.log(searchQuery,'searchQuery')



    // Check if search is for a city or property type
    // const city =await City.findOne({ cityName: searchQuery },{ _id: 1 });
    // const propertyType = await Developer.findOne({ developerName: regex },{ _id: 1 });


    // console.log(city,propertyType,'-0-')
    // if (city) {
    //   query.$or.push({ citiesArrayRef: city._id });
    // }

    // if (propertyType) {
    //   query.$or.push({ propertyType: propertyType._id });
    // }

    // const searchResult = await PropertyModel.find({
    //   $or: [
    //     { projectTitle: { $regex: searchQuery, $options: 'i' } }, // Match query in the "name" field
    //   ],
    // });


    // const searchResult = await PropertyModel.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { projectTitle: { $regex: searchQuery, $options: 'i' } }, // Match query in the "projectTitle" field
    //       ],
    //     },
    //   },
    // ]);


    const items = await PropertyModel.aggregate([
      {
        $match: {
          $or: [
            { projectTitle: { $regex: searchQuery, $options: 'i' } }, // Match query in the "projectTitle" field
          ],
        },
      },
      {
        $set: {
          cities: {
            $map: {
              input: "$cities", // The array of string IDs
              as: "cityId",     // Temporary variable for each element
              in: { $toObjectId: "$$cityId" } // Convert each string to ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: "cities", // Name of the related collection
          localField: "cities", // The converted ObjectId array
          foreignField: "_id", // Field in the `cities` collection to match
          as: "cityDetails" // Output array with matched documents
        }
      },
      {
        $set: {
          developer: { $toObjectId: "$developer" } // Convert the `developer` string to ObjectId
        }
      },
      {
        $lookup: {
          from: "developers", // Name of the related collection
          localField: "developer", // The converted ObjectId
          foreignField: "_id", // Field in the `developers` collection to match
          as: "developerDetails" // Output array with matched documents
        }
      },
      {
        $unwind: "$developerDetails" // Ensure developer details are a single object
      },
      {
        $set: {
          adsOptions: { $cond: { if: { $not: "$adsOptions" }, then: null, else: { $toObjectId: "$adsOptions" } } } // Convert the `adsOptions` string to ObjectId if present
        }
      },
      
      {
        $lookup: {
          from: "sidebannerlogos", // Name of the related collection
          localField: "adsOptions", // The converted ObjectId
          foreignField: "_id", // Field in the `sidebannerlogos` collection to match
          as: "adsDetails" // Output array with matched documents
        }
      },
      {
        $unwind: {
          path: "$adsDetails",
          preserveNullAndEmptyArrays: true // Include documents without adsDetails
        }
      }
    ]);
    


    // Perform the optimized query
    // const getProperties = await PropertyModel.find(query).skip((page - 1) * limit).limit(limit);
    // 
    // if (!getProperties || getProperties.length === 0) {
    //   return res.status(404).json({ message: "No properties found" });
    // }

    // const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    // const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    // const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(items);

    return res.status(200).json({ result: sortedProjects });

  } catch (error) {
    return res.status(400).json({ message: error.message || "Internal server error!" }).end();
  }
};

export const getProjectsByPropertyTypeId = async (req, res, next) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).json({ message: "Property type not provided" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 100;

    const matchConditions = {
      isSold: false,
      draft: false,
      propertyType: { $in: [name] }, // Match if `name` exists in the `propertyType` array
    };

    const items = await PropertyModel.aggregate([
      {
        $match: matchConditions, // Match documents with the specified conditions
      },
      {
        $set: {
          cities: {
            $map: {
              input: "$cities", // The array of city IDs
              as: "cityId",
              in: { $toObjectId: "$$cityId" }, // Convert string IDs to ObjectId
            },
          },
        },
      },
      {
        $lookup: {
          from: "cities", // Name of the `cities` collection
          localField: "cities", // Field in the current collection
          foreignField: "_id", // Field in the `cities` collection
          as: "cityDetails", // Output field for joined data
        },
      },
      {
        $set: {
          developer: { $toObjectId: "$developer" }, // Convert the `developer` field to ObjectId
        },
      },
      {
        $lookup: {
          from: "developers", // Name of the `developers` collection
          localField: "developer", // Field in the current collection
          foreignField: "_id", // Field in the `developers` collection
          as: "developerDetails", // Output field for joined data
        },
      },
      {
        $unwind: "$developerDetails", // Ensure `developerDetails` is a single object
      },
      {
        $set: {
          adsOptions: {
            $cond: {
              if: { $not: "$adsOptions" },
              then: null,
              else: { $toObjectId: "$adsOptions" }, // Convert `adsOptions` to ObjectId if present
            },
          },
        },
      },
      {
        $lookup: {
          from: "sidebannerlogos", // Name of the `sidebannerlogos` collection
          localField: "adsOptions", // Field in the current collection
          foreignField: "_id", // Field in the `sidebannerlogos` collection
          as: "adsDetails", // Output field for joined data
        },
      },
      {
        $unwind: {
          path: "$adsDetails",
          preserveNullAndEmptyArrays: true, // Include documents even if `adsDetails` is null
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ result: items });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" });
  }
};


export const getProjectsByCityId = async (req,res,next)=>{
  try {
    const id = req.params.id;

    // Ensure searchQuery is sanitized and valid
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
      // Query the Property model to check if the cityId exists in the cities array
      // const matchingProjects = await Property.find({ cities: id });


      const items = await Property.aggregate([
        {
          $match: {
            cities: id
          }, // Combine all match conditions
        },
        {
          $set: {
            cities: {
              $map: {
                input: "$cities", // The array of string IDs
                as: "cityId",     // Temporary variable for each element
                in: { $toObjectId: "$$cityId" } // Convert each string to ObjectId
              }
            }
          }
        },
        {
          $lookup: {
            from: "cities", // Name of the related collection
            localField: "cities", // The converted ObjectId array
            foreignField: "_id", // Field in the `cities` collection to match
            as: "cityDetails" // Output array with matched documents
          }
        },
        {
          $set: {
            developer: { $toObjectId: "$developer" } // Convert the `developer` string to ObjectId
          }
        },
        {
          $lookup: {
            from: "developers", // Name of the related collection
            localField: "developer", // The converted ObjectId
            foreignField: "_id", // Field in the `developers` collection to match
            as: "developerDetails" // Output array with matched documents
          }
        },
        {
          $unwind: "$developerDetails" // Ensure developer details are a single object
        },
        {
          $set: {
            adsOptions: { $cond: { if: { $not: "$adsOptions" }, then: null, else: { $toObjectId: "$adsOptions" } } } // Convert the `adsOptions` string to ObjectId if present
          }
        },
        {
          $lookup: {
            from: "sidebannerlogos", // Name of the related collection
            localField: "adsOptions", // The converted ObjectId
            foreignField: "_id", // Field in the `sidebannerlogos` collection to match
            as: "adsDetails" // Output array with matched documents
          }
        },
        {
          $unwind: {
            path: "$adsDetails",
            preserveNullAndEmptyArrays: true // Include documents without adsDetails
          }
        }
      ])
    
      
    // const getProperties = await PropertyModel.find({citiesArrayRef: new mongoose.Types.ObjectId(id),isSold:false}).sort({"createdAt": 1});
    // const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    // const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    // const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(items);

    return res.status(200).json({ result: sortedProjects }).end();
  
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const getProjectsByDevelopersId = async (req,res,next)=>{
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    // Convert the developerId string to an ObjectId
    const developerObjectId = new mongoose.Types.ObjectId(id);

    const items = await Property.aggregate([
   
      {
        $match: {
          developer: developerObjectId
        }, // Combine all match conditions
      },
      {
        $set: {
          cities: {
            $map: {
              input: "$cities", // The array of string IDs
              as: "cityId",     // Temporary variable for each element
              in: { $toObjectId: "$$cityId" } // Convert each string to ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: "cities", // Name of the related collection
          localField: "cities", // The converted ObjectId array
          foreignField: "_id", // Field in the `cities` collection to match
          as: "cityDetails" // Output array with matched documents
        }
      },
      {
        $set: {
          developer: { $toObjectId: "$developer" } // Convert the `developer` string to ObjectId
        }
      },
      {
        $lookup: {
          from: "developers", // Name of the related collection
          localField: "developer", // The converted ObjectId
          foreignField: "_id", // Field in the `developers` collection to match
          as: "developerDetails" // Output array with matched documents
        }
      },
      {
        $unwind: "$developerDetails" // Ensure developer details are a single object
      },
      {
        $set: {
          adsOptions: { $cond: { if: { $not: "$adsOptions" }, then: null, else: { $toObjectId: "$adsOptions" } } } // Convert the `adsOptions` string to ObjectId if present
        }
      },
      {
        $lookup: {
          from: "sidebannerlogos", // Name of the related collection
          localField: "adsOptions", // The converted ObjectId
          foreignField: "_id", // Field in the `sidebannerlogos` collection to match
          as: "adsDetails" // Output array with matched documents
        }
      },
      {
        $unwind: {
          path: "$adsDetails",
          preserveNullAndEmptyArrays: true // Include documents without adsDetails
        }
      }
    ])

    // const getProperties = await PropertyModel.find({developerRef: new mongoose.Types.ObjectId(id)})
    // .sort({"createdAt": 1});
    // const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    // const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    // const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(items);

    return res.status(200).json({ result: sortedProjects }).end();
  
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const getEnquiryUnderAgency = async (req, res, next) => {
  try {

    if(!req.user.isAgency){
      return res.status(400).json({ message: "You are not authorized!" }).end();
    }

    console.log(req.user.id)

    const items = await Enquiry.aggregate([
      {$match:{
        assignedTo:new mongoose.Types.ObjectId(req.user.id)
      }},
      {
        $set: {
          developerId: { $toObjectId: "$developerId" },
          propertyId: { $toObjectId: "$propertyId" }
        }
      },
      {
        $lookup: {
          from: "developers",
          localField: "developerId",
          foreignField: "_id",
          as: "developerDetails"
        }
      },
      {
        $unwind: "$developerDetails"
      },
      {
        $lookup: {
          from: "properties",
          localField: "propertyId",
          foreignField: "_id",
          as: "propertyDetails"
        }
      },
      {
        $unwind: "$propertyDetails"
      }
    ]);
    // const isAssignedEnquiries  = await Enquiry.find({ assignedTo: new mongoose.Types.ObjectId(req.user.id) });

   
    const sortedProperties = items?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return res.status(200).json({ result: sortedProperties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const enqChangeNoteStatus = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existEnq = await Enquiry.findById(req.params.id);

    // console.log(existEnq,'existEnq')

    if (!existEnq) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    // console.log(req.body)

   existEnq.note = req.body.note;

   await existEnq.save()

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteExistingCityByPropertyIdAndCityId = async (req, res, next) => {
  try {
    if (!req.params.cityId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
    if (!req.params.propertyId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
  
    const existProperty = await PropertyModel.findById(req.params.propertyId);

    existProperty.citiesArrayRef.pull(req.params.cityId);
    await existProperty.save();

    if (!existProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const deleteExistingPropertyTypeByPropertyIdAndPropertyTypeId = async (req, res, next) => {
  try {
    if (!req.params.propertyTypeId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
    if (!req.params.propertyId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
  
    const existProperty = await PropertyModel.findById(req.params.propertyId);

    existProperty.propertyType.pull(req.params.propertyTypeId);
    await existProperty.save();

    if (!existProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const updateToggleLock = async (req, res, next) => {
  try {

    // console.log(req.params)
    if (!req.params.lockStatus && !req.params.enquiryId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existEnq = await Enquiry.findById(req.params.enquiryId);

    if (!existEnq) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

console.log(existEnq.isLocked,'existEnq.isLocked')
console.log(req.params.lockStatus)
    existEnq.isLocked = req.params.lockStatus === 'lock' ? true : false;

    await existEnq.save()

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};




// Validation schema for required fields
const updateDetails = Joi.object({
  projectTitle: Joi.string().min(3).max(250).required(), // Title must be between 3-100 characters
  priceInAED: Joi.string().required(), // Ensure price is numeric (as string)
  handoverDate: Joi.date().iso().required(), // ISO date format
  beds: Joi.string().required(), // Ensure beds are numeric (as string)
  address:Joi.string().allow(''),
  adsOptions: Joi.string().allow(''), //
  description: Joi.string().allow(''), //
  draft:Joi.boolean().allow(''), //
  isChecked : Joi.boolean().allow(''), //
  mapLink  : Joi.string().allow(''), //
  projectVideo: Joi.string().allow(''),
  projectNumber : Joi.string().allow('')
});

export const updateProjectBasicDetails = async (req, res, next) => {
  try {

    // console.log(req.body)
    // return true
    // console.log(req.params)
    if (!req.params.id ) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(req.params.id);

    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    console.log(req.body,'req.body')

    const isUpdated = await PropertyModel.findByIdAndUpdate(req.params.id,{$set:req.body});

   console.log(isUpdated)

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};




export const updatePropertyImage = async (req, res, next) => {
  try {

    // console.log(req.params)
    // console.log(req.body);
    // return true
    // console.log(req.params)
    if (!req.params.id ) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(req.params.id);

    // console.log(isProperty,'isProperty')
    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    const obj = {};

// Check and add fields dynamically
if (req.body.imageFile) {
  obj.imageFile = req.body.imageFile; // Add imageFile to obj
  const isUpdated = await PropertyModel.findByIdAndUpdate(
    req.params.id,
    { $set: {imageFile:req.body.imageFile} }, // Use dynamically built obj
    { new: true } // Return the updated document
  );
}

if (req.body.imageFiles) {
  obj.imageFiles = req.body.imageFiles; // Add imageFiles to obj
  isProperty.imageFiles.push(...req.body.imageFiles);
  await isProperty.save(obj);
}


    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const deleteProjectByIdImage = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the property ID
    const { image } = req.body; // Get the image object from the request body

    if (!id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    if (!image || !image.asset_id) {
      return res.status(400).json({ message: "Image details not provided!" }).end();
    }

    // Find and update the property by removing the image from the imageFiles array
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        $pull: { imageFiles: { asset_id: image.asset_id } }, // Remove the image with the matching asset_id
      },
      { new: true } // Return the updated document
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found!" }).end();
    }

    return res.status(200).json({
      message: "Image successfully deleted",
      updatedProperty, // Optional: Return the updated property details
    }).end();
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};




export const updateOtherOptions = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the property ID

    // console.log(req.body,'body')
    // return true;
    if (!id) {
      return res.status(400).json({ message: "Id Not Provided!" });
    }


    console.log(req.body,'body')
    // return true
    // Find the property by ID
    const isProperty = await PropertyModel.findById(id);

    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" });
    }

    let updated = false;

    // Update cities if provided
    if (req.body.cities && req.body.cities.length > 0) {
      const citiesToAdd = req.body.cities.filter(city => !isProperty.cities.includes(city));
      if (citiesToAdd.length > 0) {
        isProperty.cities.push(...citiesToAdd);
        updated = true;
      }
    }

    // Update property types if provided
    if (req.body.propertyType && req.body.propertyType.length > 0) {
      const propertyTypesToAdd = req.body.propertyType.filter(type => !isProperty.propertyType.includes(type));
      console.log(propertyTypesToAdd);
      // console.log(isProperty.propertyType,'propertyType');
      // return true;
      if (propertyTypesToAdd.length > 0) {
        isProperty.propertyType.push(...propertyTypesToAdd);
        updated = true;
      }
    }

    // Update developer if provided
    if (req.body.developer) {
      isProperty.developer = req.body.developer;
      updated = true;
    }

    if (
      req.body.priority !== undefined ||
      req.body.facilities !== undefined ||
      req.body.paymentOptions !== undefined ||
      req.body.nearbyAreas !== undefined ||
      req.body.draft !== undefined ||
      req.body.isSold !== undefined
    ) {
      const obj = {};
    
      // Add fields conditionally
      if (req.body.priority !== undefined) {
        obj.priority = req.body.priority;
        obj.priorityExists = true; // Add an extra field for priority
      }
    
      if (req.body.facilities !== undefined) {
        obj.facilities = req.body.facilities;
      }
    
      if (req.body.paymentOptions !== undefined) {
        obj.paymentOptions = req.body.paymentOptions;
      }
    
      if (req.body.nearbyAreas !== undefined) {
        obj.nearbyAreas = req.body.nearbyAreas;
      }
    
      if (req.body.draft !== undefined) {
        obj.draft = req.body.draft;
      }
    
      if (req.body.isSold !== undefined) {
        obj.isSold = req.body.isSold;
      }

      if(req.body.adsOptions !== undefined) {
        obj.adsOptions = req.body.adsOptions;
      }
    
      // Update the document in MongoDB
      await PropertyModel.findByIdAndUpdate(id, { $set: { ...obj } });
    }
   
    // If any update was made, save the property
    if (updated) {
      await isProperty.save();
    }



    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    console.error(error); // Optional: For debugging
    return res.status(500).json({ message: error.message || "Internal server error!" });
  }
};




export const deleteCityFromProjectById = async (req, res, next) => {
  try {
    const { projectId,cityId } = req.params; // Get the property ID
    if (!projectId || !cityId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(projectId);

    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    if(isProperty.cities.length === 1){
      return res.status(400).json({ message: "You can't delete the last city!!" }).end();
    }

    const isPulled = await PropertyModel.findByIdAndUpdate(projectId,{$pull:{cities:cityId}});

if(!isPulled){
  return res.status(400).json({ message: "City Not Exist!!" }).end();
}
    
    return res.status(200).json({
      message: "Successfully deleted",
    }).end();

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const deletePropertyTypeFromProjectById = async (req, res, next) => {
  try {
    const { projectId,typeId } = req.params; // Get the property ID
    if (!projectId || !typeId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(projectId);

    // console.log(isProperty,'isProperty')
    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    if(isProperty.propertyType.length === 1){
      return res.status(400).json({ message: "You can't delete the last property type!!" }).end();
    }

    const isPulled = await PropertyModel.findByIdAndUpdate(projectId,{$pull:{propertyType: typeId}});

if(!isPulled){
  return res.status(400).json({ message: "City Not Exist!!" }).end();
}
    
    return res.status(200).json({
      message: "Successfully deleted",
    }).end();

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const deletePriorityFromProjectById = async (req, res, next) => {
  try {
    const { projectId,item } = req.params; // Get the property ID
    if (!projectId || !item) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(projectId);

    // console.log(isProperty,'isProperty')
    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

   if(!(isProperty && isProperty.priority)) return res.status(404).json({ message: "Property Priority Not Exist!!" }).end();
    
    const result = await PropertyModel.findByIdAndUpdate(projectId,{$set:{priorityExists:false},$unset: {priority:''} });

    if(!result){
      return res.status(400).json({ message: "Priority Not Exist!!" }).end();
    }
  return res.status(200).json({
    message: "Successfully deleted",
  }).end(); 

    


  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const deleteAdsFromProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params; // Get the property ID
    if (!projectId ) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(projectId);

    // console.log(isProperty,'isProperty')
    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

   if(!(isProperty && isProperty.adsOptions)) return res.status(404).json({ message: "Property Ads Not Exist!!" }).end();
    
    const result = await PropertyModel.findByIdAndUpdate(projectId,{$unset: { adsOptions:''} });

    if(!result){
      return res.status(400).json({ message: "Priority Not Exist!!" }).end();
    }
  return res.status(200).json({
    message: "Successfully deleted",
  }).end(); 

    


  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};






export const getPropertyCountFromProject = async (req, res, next) => {
  try {
 

    const result = await PropertyModel.aggregate([
      {
        $unwind: "$propertyType", // Unwind the propertyType array to count each property type separately
      },
      {
        $group: {
          _id: "$propertyType", // Group by property type
          totalProperties: { $sum: 1 }, // Count each document within each property type
        },
      },
      {
        $project: {
          _id: 0,
          propertyType: "$_id", // Rename _id to propertyType
          totalProperties: 1, // Keep the count
        },
      },
      {
        $sort: { propertyType: 1 }, // Sort alphabetically by property type
      },
    ]);

    return res.status(200).json({
      result: result,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};




export const updateProductStatusToPublic = async (req, res, next) => {
  try {

    // console.log(req.params)
    // console.log(req.body);
    // return true
    // console.log(req.params)
    if (!req.params.id ) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const isProperty = await PropertyModel.findById(req.params.id);

    // console.log(isProperty,'isProperty')
    // return true
    if (!isProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    isProperty.draft = false;
    await isProperty.save();

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};