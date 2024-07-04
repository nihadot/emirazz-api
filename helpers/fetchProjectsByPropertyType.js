import PropertyType from "../model/PropertyType.js";

export const fetchProjectsByPropertyType = async (items, status) => {
  let arr = [];

  for (let item of items) {
    if (item?.propertyType?.length > 0) {
      const propertyTypePromises = item.propertyType.map((propertyTypeId) =>
        PropertyType.findById(propertyTypeId)
      );

      const propertyTypeInfo = await Promise.all(propertyTypePromises);
      if (status) {
        arr.push({ ...item._doc, propertyType: propertyTypeInfo });
      } else {
        arr.push({ ...item, propertyType: propertyTypeInfo });
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
