import mongoose from "mongoose";
import Property from "../model/Property.js";
import Developer from "../model/Developer.js";
import City from "../model/City.js";

export const getAll = async (req, res, next) => {
  try {
    const getProperties = await Property.find({isSold:false}).select("+priority");

    // return true
    const allPriorities = [];
    for (let property of getProperties) {
      if (property?.priority) {
        allPriorities.push(property?.priority);
      }
    }


    const getPropertiess = await Property.find({ 
      isSold: false, 
      priority: { $exists: true, $ne: null } 
    }).select("priority");

    console.log(getPropertiess,'getPropertiess')

    return res.status(200).json({ result: allPriorities }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllPriorityOfDevelopers = async (req, res, next) => {
  try {
    const getAllDevelopers = await Developer.find().select("+priority");

    // return true
    const allPriorities = [];
    for (let developer of getAllDevelopers) {
      if (developer?.priority) {
        allPriorities.push(developer?.priority);
      }
    }

    return res.status(200).json({ result: allPriorities }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllPriorityOfCities = async (req, res, next) => {
  try {
    const getAllCities = await City.find().select("+priority");

    // return true
    const allPriorities = [];
    for (let city of getAllCities) {
      if (city?.priority) {
        allPriorities.push(city?.priority);
      }
    }

    return res.status(200).json({ result: allPriorities }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deletePriority = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    if (!req.params.type) {
      return res.status(400).json({ message: "type Not Provided!" }).end();
    }
    
    if (req.params.type === "developer") {
      await Developer.findByIdAndUpdate(req.params.id, {
        $unset: { priority: "" },
      });
    }

    console.log(req.params.type)
    console.log(req.params.id)
    if (req.params.type === "city") {
       await City.findByIdAndUpdate(req.params.id, {
        $unset: { priority: "",priorityExists:false },
     
      });
    }

    if (req.params.type === "property") {
      await Property.findByIdAndUpdate(req.params.id, {
        $unset: { priority: "" },
      });
    }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
