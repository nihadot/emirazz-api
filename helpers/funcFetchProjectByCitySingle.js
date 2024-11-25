import { CityModel } from "../model/City.js";

export const funcFetchProjectByCitySingle = async (item) => {
  let citiesInfo = [];

  if (item?.projectCities?.length > 0) {
    try {
      // Fetch all cities whose _id is in the item.city array
      citiesInfo = await CityModel.find({ _id: { $in: item.projectCities } });

      // Return the item along with the fetched cities info
      return { ...item, citiesInfo };
    } catch (error) {
      console.error("Error fetching city info:", error);

      // Return the item with empty citiesInfo in case of error
      return { ...item, citiesInfo: [] };
    }
  } else {
    // If item.city is empty or undefined, just return the item without city info
    return { ...item, citiesInfo: [] };
  }
};
