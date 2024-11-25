import  { CityModel } from "../model/City.js";

export const funFetchProjectsByCity = async (items) => {
  let arr = [];
  for (let item of items) {
    if (item?.projectCities?.length > 0) {
      const cities = await CityModel.find({ _id: { $in: item?.projectCities } });
      arr.push({ citiesInfo: cities, ...item });
    } else {
      arr.push({ ...item });
    }
  }
  return arr;
};
