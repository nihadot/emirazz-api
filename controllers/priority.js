import mongoose from "mongoose";
import Property from "../model/Property.js";



export const getAll = async (req, res, next) => {
  try {
   
    const getProperties = await Property.find().select("+priority");
    
    // return true
    const allPriorities = [];
    for (let property of getProperties) {
      console.log(property?.priority,'-')
      if (property?.priority) {
        allPriorities.push(property?.priority)
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
