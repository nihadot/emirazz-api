import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DeveloperModel, { addDeveloperSchema } from "../model/Developer.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Property from "../model/Property.js";
import mongoose from "mongoose";
import { sortProjects } from "../helpers/sortProjects.js";
import slugify from "slugify";

export const create = async (req, res, next) => {
  try {
    const { error, value } = addDeveloperSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }



    const isExist = await DeveloperModel.findOne({developerName: req.body.developerName});


      if(isExist){
        return res.status(400).json({ message: "Developer name already exists" }).end();
      }

        // create slug url
        const slugName = slugify(req.body.developerName,{lower:true});

        const isSlug = await DeveloperModel.findOne({slug: slugName});


        if(isSlug){
          return res.status(400).json({ message: "Developer Name already exists" }).end();
        }

        value.slug = slugName;

    if(value.priority){
      value.priorityExists = true;
     }



    const newDeveloper = new DeveloperModel(value);
    const savedDeveloper = await newDeveloper.save();
    return res.status(200).json({ result: savedDeveloper }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {

    const developersWithProjectCount = await DeveloperModel.aggregate([
      {
        $lookup: {
          from: "properties", // Name of the collection (should be lowercase and pluralized)
          localField: "_id", // Developer's ID
          foreignField: "developer", // Field in Property schema that references Developer
          as: "projects", // Name of the array that will store the joined documents
        }
      },
      {
        $addFields: {
          projectCount: { $size: "$projects" } // Add a new field with the count of projects
        }
      },
  
    ]);

    // const getDevelopers = await DeveloperModel.find();

    const sortedDevelopers = sortProjects(developersWithProjectCount);

    return res.status(200).json({ result: sortedDevelopers }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const getDeveloperById = async (req, res, next) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const getDeveloper = await DeveloperModel.find(req.params.id);

    return res.status(200).json({ result: getDeveloper }).end();
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

    const existingDeveloper = await DeveloperModel.findById(req.params.id);

    if (!existingDeveloper) {
      return res.status(400).json({ message: "Developer Not Exist!!" }).end();
    }
    console.log(req.body,'-req.body')

    let data = {
      developerName: req.body.developerName,
        password: req.body.password,
        username: req.body.username,
    };
    if(req.body.priority){
      data.priorityExists = true;
      data.priority = req.body.priority;
    }else{
      data.priorityExists = false;
      data.priority = null;
    }
    const toCOnvertString = Object.keys(req.body.imageFile).length > 0 && true;

    if(toCOnvertString){
      data.imageFile = req.body.imageFile;
    }


    await DeveloperModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...data } },
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

    const existingDeveloper = await DeveloperModel.findById(req.params.id);

    if (!existingDeveloper) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    const isExistingDeveloper = await Property.findOne({developer:new mongoose.Types.ObjectId(req.params.id)});

    if(isExistingDeveloper){
      return res.status(400).json({ message: "Already property available under the developer" }).end();
    }

    await DeveloperModel.findByIdAndDelete(req.params.id);


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const getDevelopersByName = async (req, res, next) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const isExist = await DeveloperModel.findOne({slug:name});

    if(!isExist){
      return res.status(400).json({ message: "Developer Not Exist!!" }).end();
    }

    // Convert the developerId string to an ObjectId
    const developerObjectId = new mongoose.Types.ObjectId(isExist._id);

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
};