import CityModel, { addingCityValidationSchema } from "../model/City.js";
import PropertyModel from "../model/Property.js";
import mongoose from "mongoose";
import { deleteFile } from "../middleware/deleteFile.js";
import Property from "../model/Property.js";
import { fetchCitiesAndCount } from "../helpers/fetchCitiesAndCount.js";
import { sortProjects } from "../helpers/sortProjects.js";
import City from "../model/City.js";
import slugify from "slugify";

export const create = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = addingCityValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const isExist = await CityModel.findOne({cityName: req.body.cityName});


    if(isExist){
      return res.status(400).json({ message: "City name already exists" }).end();
    }

    if(value.priority){
     value.priorityExists = true;
    }

          // create slug url
          const slugName = slugify(req.body.projectTitle,{lower:true});


    const isSlug = await CityModel.findOne({slug: slugName});


    if(isSlug){
      return res.status(400).json({ message: "City name already exists" }).end();
    }

    value.slug = slugName;

    // Create a new city using the validated data
    const newCity = new City(value);
    const savedCity = await newCity.save();

    return res.status(200).json({ result: savedCity });
  } catch (err) {
    console.error("Error creating city:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

export const getAll = async (req, res, next) => {
  try {
   
     // Using aggregate to first sort by priority, and then by creation date
    //  const getCities = await CityModel.aggregate([
    //   {
    //     $sort: {
    //       priority: 1,      // Sort by priority in ascending order (1, 2, 3, ...)
    //       createdAt: -1,     // Then sort by createdAt timestamp (most recent first)
    //     },
    //   },
    // ]);


    const result = await CityModel.aggregate([
      {
        $lookup: {
          from: "properties", // Property collection
          let: { cityId: { $toString: "$_id" } }, // Convert City _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$cityId", "$cities"], // Check if the cityId exists in the cities array
                },
              },
            },
          ],
          as: "matchingProperties", // Alias for joined data
        },
      },
      {
        $addFields: {
          propertyCount: { $size: "$matchingProperties" }, // Count matching properties
        },
      },
  
    ]);
  
  
  

    // const getCitiesWithCount = await fetchCitiesAndCount(getCities,true);

    const sortedCities = sortProjects(result)

    return res.status(200).json({ result:  sortedCities }).end();
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

    const existingCity = await CityModel.findById(req.params.id);

    if (!existingCity) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }


    let data = {
      emirateName : req.body.emirateName,
      cityName : req.body.cityName,
    };

    if(req.body.priority){
      data.priorityExists = true;
      data.priority = req.body.priority;
    }else{
      data.priorityExists = false;
      data.priority = null;
    }

    
    const toCOnvertString = Object.keys(req.body.imageFile).length > 0 && true;
    // console.log(toCOnvertString,'ss')
    // return true

    if(toCOnvertString){
      data.imageFile = req.body.imageFile;
    }
 
    await CityModel.findByIdAndUpdate(
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

    const existingCity = await CityModel.findById(req.params.id);

    if (!existingCity) {
      return res.status(400).json({ message: "City Not Exist!!" }).end();
    }

    const isExistingCity = await Property.findOne({cities:new mongoose.Types.ObjectId(req.params.id)});

    if(isExistingCity){
      return res.status(400).json({ message: "Already property avalible under the city" }).end();
    }

    await CityModel.findByIdAndDelete(req.params.id);


    return res.status(200).json({ message: "Successfully Deleted" }).end();
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
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }


     // Using aggregate to first sort by priority, and then by creation date
     const getCity = await CityModel.findById(req.params.id);

    return res.status(200).json({ result:  getCity }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};






















