import { DeveloperModel } from "../model/Developer.js";

export const funcFetchProjectByDeveloperSingle = async (item) => {
  let obj = {};
  
  if (item && item.developer) {
    try {
      // Fetch developer info by ID
      const developerInfo = await DeveloperModel.findById(item.developer);
      
      // If developerInfo is found, spread the _doc, otherwise set an empty object
      obj = { ...item, developerInfo: developerInfo ? developerInfo._doc : {} };
    } catch (error) {
      console.error("Error fetching developer info:", error);
      obj = { ...item, developerInfo: {} }; // return item without developer info if there's an error
    }
  } else {
    obj = { ...item };
  }

  return obj; // Ensure the function returns the object
};
