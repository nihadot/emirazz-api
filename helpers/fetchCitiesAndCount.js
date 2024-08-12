import mongoose from "mongoose";
import Property from "../model/Property.js";

export const fetchCitiesAndCount = async (items, status) => {
  const arr = await Promise.all(
    items.map(async (item) => {
      if (!item) {
        return status ? { ...item?._doc } : { ...item };
      }
      const getCitiesCount = await Property.countDocuments({
        citiesArrayRef: new mongoose.Types.ObjectId(item._id),
      });
      return status
        ? { ...item._doc, count: getCitiesCount }
        : { ...item, count: getCitiesCount };
    })
  );
  return arr;
};
