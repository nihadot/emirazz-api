import mongoose from "mongoose";
import Property from "../model/Property.js";
export const fetchCitiesAndCount = async (items,status)=>{
    let arr = [];
    for (let item of items) {
      if (item) {
        const getCtiesCount = await Property.countDocuments({cityRef: new mongoose.Types.ObjectId(item._id)});
        if(status){
          arr.push({ ...item._doc, count: getCtiesCount });
        }else{
          arr.push({ ...item, count: getCtiesCount });
        }
      }else{
        if(status){
          arr.push({ ...item._doc});
        }else{
          arr.push({ ...item});
        }
      }
    }
    return arr;
};