import City from "../model/City.js";

export const fetchProjectsByCity = async (items, status) => {
  let arr = [];
  for (let item of items) {
    if (item?.citiesArrayRef?.length > 0) {
      const citiesInfo = item.citiesArrayRef.map((cityId) =>
        City.findById(cityId)
      );
      const citiesInfoResult = await Promise.all(citiesInfo);

      if (status) {
        arr.push({ citiesInfo: citiesInfoResult, ...item._doc });
      } else {
        arr.push({ citiesInfo: citiesInfoResult, ...item });
      }
    } else {
      if (status) {
        arr.push({ ...item._doc });
      } else {
        arr.push({ ...item });
      }
    }
  }
  return arr;
};
