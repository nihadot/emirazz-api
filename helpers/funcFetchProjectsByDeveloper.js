import  { DeveloperModel } from "../model/Developer.js";

export const funcFetchProjectsByDeveloper = async (items) => {
  let arr = [];
  for (let item of items) {
    if (item?.developer) {
      const developerInfo = await DeveloperModel.findById(
        item?.developer
      );
      arr.push({ developerInfo: developerInfo ? developerInfo._doc : {}, ...item });
    } else {
      arr.push({ ...item });
    }
  }
  return arr;
};
