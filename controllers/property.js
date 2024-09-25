import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PropertyModel from "../model/Property.js";
import Enquiry from "../model/Enquiry.js";
import mongoose from "mongoose";
import Property from "../model/Property.js";
import PropertyType from "../model/PropertyType.js";
import { deleteFile } from "../middleware/deleteFile.js";
import Developer from "../model/Developer.js";
import { fetchProjectsByDeveloper } from "../helpers/fetchProjectsByDeveloper.js";
import { fetchProjectsByPropertyType } from "../helpers/fetchProjectsByPropertyType.js";
import { fetchProjectsByCity } from "../helpers/fetchProjectsByCity.js";
import { sortProjects } from "../helpers/sortProjects.js";
import Notification from "../model/Notification.js";
import AssignedModel from "../model/AssigendProjects.js";
import Agency from "../model/Agency.js";
import City from "../model/City.js";

export const create = async (req, res, next) => {
  try {
    const { propertyType, citiesArrayRef,facilities, paymentPlan, areasNearBy, smallImage } =
      req.body;

    let propertyTypeVariable;
    let facilitiesVariable;
    let areasNearByVariable;
    let paymentPlanByVariable;
    let smallImageVariable;
    let citiesArrayRefVariable;

    if (propertyType) {
      propertyTypeVariable = JSON.parse(req.body.propertyType);
    }

    if (citiesArrayRef) {
      citiesArrayRefVariable = JSON.parse(req.body.citiesArrayRef);
    }

    if (facilities) {
      facilitiesVariable = JSON.parse(req.body.facilities);
    }
    if (paymentPlan) {
      paymentPlanByVariable = JSON.parse(req.body.paymentPlan);
    }
    if (areasNearBy) {
      areasNearByVariable = JSON.parse(req.body.areasNearBy);
    }
    if (smallImage) {
      smallImageVariable = JSON.parse(req.body.smallImage);
    }

    if (req.body.propertyType) {
      delete req.body.propertyType;
    }
    if(req.body.citiesArrayRefVariable){
      delete req.body.citiesArrayRef;
    }
    if (req.body.facilities) {
      delete req.body.facilities;
    }
    if (req.body.paymentPlan) {
      delete req.body.paymentPlan;
    }
    if (req.body.areasNearBy) {
      delete req.body.areasNearBy;
    }
    if (req.body.smallImage) {
      delete req.body.smallImage;
    }
    if (!req.body.sideBarRef) {
      delete req.body.sideBarRef;
    }
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";

    let ArraysmallImage = [];

    if (req.files.smallImage && req.files.smallImage.length > 0) {
      Array.from(req.files.smallImage).forEach((item) =>
        ArraysmallImage.push(item.filename)
      );
    }

    const newProperty = new PropertyModel({
      ...req.body,
      citiesArrayRef:citiesArrayRefVariable,
      propertyType: propertyTypeVariable,
      facilities: facilitiesVariable,
      areasNearBy: areasNearByVariable,
      paymentPlan: paymentPlanByVariable,
      smallImage: ArraysmallImage,
      mainImgaeLink: mainImgaeLink,
    });

    const isExistDeveloper = await Developer.findById(req.body.developerRef);

    if(!isExistDeveloper){
      return res.status(400).json({ message: "Developer not found" }).end();
    }


    const newNotification = new Notification({
      title:`New project launched by ${isExistDeveloper?.developerName} Starting From ${req.body.price}`,
      mainImgaeLink:mainImgaeLink,
    })

    const savedProperty = await newProperty.save();
    const savedNotification = await newNotification.save();
    
    return res.status(200).json({ result: savedProperty }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const addEnq = async (req, res, next) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const savedEnquiry = await newEnquiry.save();
    return res.status(200).json({ result: savedEnquiry }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {

    let isSold = false

    if(req.query.issold === 'sold'){
       isSold = true
    }
    const page = parseInt(req.query.page) || 1;
    const limit = 100; 
  
    const items = await PropertyModel.find({isSold:isSold}).skip((page - 1) * limit).limit(limit);

    const projectsWithPropertyType = await fetchProjectsByPropertyType(items,true);
    const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(projectsWithCity);
    return res.status(200).json({ result: sortedProjects });


  }catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "id not Provided" });
    }
    const getProperty = await PropertyModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
    ]);

    const properties = [];
    for (let property of getProperty) {
      const propertyArray = [];
      const cityArray = [];
      if (property?.propertyType?.length > 0) {
        for (let propertyId of property?.propertyType) {
          const propertyInfo = await PropertyType.findById(propertyId);
          propertyArray.push(propertyInfo);
        }
      }
      if (property?.citiesArrayRef?.length > 0) {
        for (let cityId of property?.citiesArrayRef) {
          const cityInfo = await City.findById(cityId);
          cityArray.push(cityInfo);
        }
      }
      properties.push({ ...property, propertyType: propertyArray,citiesInfo: cityArray});
    }
    return res.status(200).json({ result: properties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    // --------------------------
    const { propertyType,citiesArrayRef,facilities, paymentPlan, areasNearBy, smallImage } =
      req.body;

    let propertyTypeVariable;
    let facilitiesVariable;
    let areasNearByVariable;
    let paymentPlanByVariable;
    let smallImageVariable;
    let citiesArrayRefVariable;


    if (propertyType) {
      propertyTypeVariable = JSON.parse(req.body.propertyType);
    }
    if (citiesArrayRef) {
      citiesArrayRefVariable = JSON.parse(req.body.citiesArrayRef);
    }
    if (facilities) {
      facilitiesVariable = JSON.parse(req.body.facilities);
    }
    if (paymentPlan) {
      paymentPlanByVariable = JSON.parse(req.body.paymentPlan);
    }
    if (areasNearBy) {
      areasNearByVariable = JSON.parse(req.body.areasNearBy);
    }
    if (smallImage) {
      smallImageVariable = JSON.parse(req.body.smallImage);
    }

    if (req.body.propertyType) {
      delete req.body.propertyType;
    }
    if(req.body.citiesArrayRefVariable){
      delete req.body.citiesArrayRef;
    }
    if (req.body.facilities) {
      delete req.body.facilities;
    }
    if (req.body.paymentPlan) {
      delete req.body.paymentPlan;
    }
    if (req.body.areasNearBy) {
      delete req.body.areasNearBy;
    }
    if (req.body.smallImage) {
      delete req.body.smallImage;
    }

    const obj = {
      ...req.body,
      // smallImage: smallImageVariable,
    };

    if (propertyTypeVariable && propertyTypeVariable.length > 0) {
      obj.propertyType = propertyTypeVariable;
    }
    if (citiesArrayRefVariable && citiesArrayRefVariable.length > 0) {
      obj.citiesArrayRef = citiesArrayRefVariable;
    }
    if (facilitiesVariable && facilitiesVariable.length > 0) {
      obj.facilities = facilitiesVariable;
    }
    if (areasNearByVariable && areasNearByVariable.length > 0) {
      obj.areasNearBy = areasNearByVariable;
    }
    if (paymentPlanByVariable && paymentPlanByVariable.length > 0) {
      obj.paymentPlan = paymentPlanByVariable;
    }
    // if (paymentPlanByVariable && paymentPlanByVariable.length > 0) {
    //   obj.mainImgaeLink = req.files.mainImgaeLink;
    // }

    // --------------
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.body._id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      if (existAccount.mainImgaeLink.length > 0) {
        const filename = existAccount.mainImgaeLink;
        const filePath = `/mainImage/${filename}`;
        try {
          await deleteFile(filePath);
        } catch (error) {
          return res
            .status(400)
            .json({ message: error.message || "Internal server error!" })
            .end();
        }
      }
    }

    // if (req.files.smallImage) {
    //   obj.smallImage = req.files.smallImage[0].filename;
    //   if (existAccount.mainImgaeLink.length > 0) {
    //     const filename = existAccount.mainImgaeLink;
    //     const filePath = `/mainImage/${filename}`;
    //     try {
    //       await deleteFile(filePath);
    //     } catch (error) {
    //       return res
    //         .status(400)
    //         .json({ message: error.message || "Internal server error!" })
    //         .end();
    //     }
    //   }
    // }

    let ArraysmallImage = [];

    if (req.files.smallImage && req.files.smallImage.length > 0) {
      Array.from(req.files.smallImage).forEach((item) =>
        ArraysmallImage.push(item.filename)
      );
    }

    await PropertyModel.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          ...obj,
        },
      },
      { new: true }
    );

    if (ArraysmallImage.length > 0) {
      const result = await PropertyModel.findById(req.body._id);
      result.smallImage.push(...ArraysmallImage);
      await result.save();
    }

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await Enquiry.findById(req.body.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    await Enquiry.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          status: req.body.status,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const updateAdsStatus = async (req, res, next) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await Property.findById(req.body.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    await Property.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          isAds: req.body.status,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    await PropertyModel.findByIdAndDelete(req.params.id);

    if (existAccount?.smallImage) {
      for (let file of existAccount?.smallImage) {
        const filePath = `/smallImage/${file}`;
        if (file) {
          const response = await deleteFile(filePath);
        }
      }
    }

    if (existAccount?.mainImgaeLink) {
      const filePath = `/mainImage/${existAccount?.mainImgaeLink}`;
      const response = await deleteFile(filePath);
    }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const saveEnquiry = await newEnquiry.save();
    return res.status(200).json({ result: saveEnquiry }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getEnquiry = async (req, res, next) => {
  try {
    const newEnquiry = await Enquiry.find();

    const newArray = [];

    // console.log(newEnquiry)

    for (let item of newEnquiry) {
      if (item) {
        // Fetch property and developer details concurrently
        const [getProperty, getDeveloper] = await Promise.all([
          PropertyModel.findById(item.propertyId),
          Developer.findById(item.developerId)
        ]);
    
        // Fetch assigned agency details if assigned exists
        let assignedAgencyName = '';
        let assignedAgencyId = '';
        if (getProperty && getDeveloper) {
          const getAssigned = await AssignedModel.findOne({ leadId: new mongoose.Types.ObjectId(item._id) });
          if (getAssigned) {
            const agency = await Agency.findById(getAssigned.agencyId);
            assignedAgencyName = agency ? agency.name : ''; // Assuming 'name' is the field in AgencyModel
            assignedAgencyId = agency ? agency._id : '';
            
          }
            newArray.push({
              ...item._doc,
              propertyName: getProperty ? getProperty.propretyHeadline : '',
              developerName: getDeveloper ? getDeveloper.developerName : '',
              assignedAgencyName: assignedAgencyName,
              assignedId: assignedAgencyId
            });
          
    
          // Push data to newArray
         
        }
      }
    }

    const sortedProperties = newArray?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return res.status(200).json({ result: sortedProperties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getCounts = async (req, res, next) => {
  try {
    const obj = {};
    const newTownhouse = await PropertyModel.countDocuments({
      propertyType: "townhouse",
    });
    const newApartment = await PropertyModel.countDocuments({
      propertyType: "apartment",
    });
    const newPenthouse = await PropertyModel.countDocuments({
      propertyType: "penthouse",
    });
    const newVilla = await PropertyModel.countDocuments({
      propertyType: "villa",
    });

    obj.townhouse = newTownhouse;
    obj.apartment = newApartment;
    obj.penthouse = newPenthouse;
    obj.villa = newVilla;
    return res.status(200).json({ result: obj }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteSmallImage = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existAccount = await PropertyModel.findById(req.params.id);

    if (!existAccount) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }

    const response = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { smallImage: req.body.smallImage },
      },
      { new: true }
    );
    const filePath = `/smallImage/${req.body.smallImage}`;
    try {
      const response = await deleteFile(filePath);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || "Internal server error!" })
        .end();
    }

    return res
      .status(200)
      .json({ message: "Successfully Deleted", result: response })
      .end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getSearchProperty = async (req, res, next) => {
  try {

    const searchQuery = req.query.q;

    // Ensure searchQuery is sanitized and valid
    if (!searchQuery) {
      return res.status(400).json({ message: "Invalid search query" });
    }

    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex


      const getProperties = await PropertyModel.find({
        $or:[
          { propretyHeadline:regex },
          {price:regex},
          {beds:searchQuery},
          {address:regex},
          {description:regex},
          {areasNearBy:{$in:[regex]}},
          {handoverDate:{$gte:new Date(searchQuery)}},
        ]
      })

      return res.status(200).json({ result: getProperties });
      
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getProjectsByPropertyTypeId = async (req,res,next)=>{
  try {
    const id = req.params.id;

    // Ensure searchQuery is sanitized and valid
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const getProperties = await PropertyModel.find({"propertyType": id,isSold:false}).sort({"createdAt": 1});
    const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(projectsWithCity);


    return res.status(200).json({ result: sortedProjects }).end();
  
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const getProjectsByCityId = async (req,res,next)=>{
  try {
    const id = req.params.id;

    // Ensure searchQuery is sanitized and valid
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const getProperties = await PropertyModel.find({citiesArrayRef: new mongoose.Types.ObjectId(id),isSold:false}).sort({"createdAt": 1});
    const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(projectsWithCity);

    return res.status(200).json({ result: sortedProjects }).end();
  
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const getProjectsByDevelopersId = async (req,res,next)=>{
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const getProperties = await PropertyModel.find({developerRef: new mongoose.Types.ObjectId(id)})
    // .sort({"createdAt": 1});
    const projectsWithPropertyType = await fetchProjectsByPropertyType(getProperties,true);
    const projectsWithDeveloper = await fetchProjectsByDeveloper(projectsWithPropertyType,false);
    const projectsWithCity = await fetchProjectsByCity(projectsWithDeveloper,false);
    const sortedProjects = sortProjects(projectsWithCity);

    return res.status(200).json({ result: sortedProjects }).end();
  
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
}

export const getEnquiryUnderAgency = async (req, res, next) => {
  try {

    if(!req.user.isAgency){
      return res.status(400).json({ message: "You are not authorized!" }).end();
    }

    const isAssignedEnquiries  = await AssignedModel.find({ agencyId: new mongoose.Types.ObjectId(req.user.id) });

    const newArray = [];

    for (let item of isAssignedEnquiries) {
      if (item) {
      
        const getLead = await Enquiry.findById(item.leadId);

        if(getLead){

          const [getProperty, getDeveloper] = await Promise.all([
            PropertyModel.findById(getLead.propertyId),
            Developer.findById(getLead.developerId)
          ]);
      
          newArray.push({
            ...getLead._doc,
            propertyName: getProperty ? getProperty.propretyHeadline : '',
            developerName: getDeveloper ? getDeveloper.developerName : '',
          });


        }
    
       
      }
    }

    const sortedProperties = newArray?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return res.status(200).json({ result: sortedProperties }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const enqChangeNoteStatus = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existEnq = await Enquiry.findById(req.params.id);

    // console.log(existEnq,'existEnq')

    if (!existEnq) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

    // console.log(req.body)

   existEnq.note = req.body.note;

   await existEnq.save()

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteExistingCityByPropertyIdAndCityId = async (req, res, next) => {
  try {
    if (!req.params.cityId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
    if (!req.params.propertyId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
  
    const existProperty = await PropertyModel.findById(req.params.propertyId);

    existProperty.citiesArrayRef.pull(req.params.cityId);
    await existProperty.save();

    if (!existProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const deleteExistingPropertyTypeByPropertyIdAndPropertyTypeId = async (req, res, next) => {
  try {
    if (!req.params.propertyTypeId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
    if (!req.params.propertyId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }
  
    const existProperty = await PropertyModel.findById(req.params.propertyId);

    existProperty.propertyType.pull(req.params.propertyTypeId);
    await existProperty.save();

    if (!existProperty) {
      return res.status(400).json({ message: "Property Not Exist!!" }).end();
    }


    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};



export const updateToggleLock = async (req, res, next) => {
  try {

    // console.log(req.params)
    if (!req.params.lockStatus && !req.params.enquiryId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existEnq = await Enquiry.findById(req.params.enquiryId);

    if (!existEnq) {
      return res.status(400).json({ message: "Enquiry Not Exist!!" }).end();
    }

console.log(existEnq.isLocked,'existEnq.isLocked')
console.log(req.params.lockStatus)
    existEnq.isLocked = req.params.lockStatus === 'lock' ? true : false;

    await existEnq.save()

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};