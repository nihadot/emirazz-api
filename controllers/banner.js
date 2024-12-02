import { deleteFile } from "../middleware/deleteFile.js";
import BannerModel from "../model/Banner.js";
import Country from "../model/Country.js";
import Language from "../model/Language.js";

export const create = async (req, res, next) => {
  try {
    const mainImgaeLink = req.files.mainImgaeLink
      ? req.files.mainImgaeLink[0].filename
      : "";
    const newBanner = new BannerModel({
      ...req.body,
      mainImgaeLink: mainImgaeLink,
    });
    const savedBanner = await newBanner.save();
    return res.status(200).json({ result: savedBanner }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getBanners = await BannerModel.find();

    return res.status(200).json({ result: getBanners }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBanner = await BannerModel.findById(req.body._id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner Not Exist!!" }).end();
    }

    let obj = {
      ...req.body,
    };
    if (req.files.mainImgaeLink) {
      obj.mainImgaeLink = req.files.mainImgaeLink[0].filename;
      if(existingBanner.mainImgaeLink && existingBanner.mainImgaeLink.length > 0){

        const filename = existingBanner.mainImgaeLink;
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
    const data = await BannerModel.findByIdAndUpdate(
      req.body._id,
      { $set: { ...obj } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Successfully Updated", result: data })
      .end();
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

    const existingBanner = await BannerModel.findByIdAndDelete(req.params.id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner Not Exist!!" }).end();
    }

    await BannerModel.findByIdAndDelete(req.params.id);

    if(existingBanner?.mainImgaeLink && existingBanner?.mainImgaeLink?.length > 0){
      const filename = existingBanner.mainImgaeLink;
      const filePath = `/mainImage/${filename}`;
      try {
        const response = await deleteFile(filePath);
      } catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }
    }

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const createLanguage = async (req, res, next) => {
  try {

    if(!req.body.languageName){
      return res.status(400).json({ message: "Language Name is Required!" }).end();
    }

    const newLanguage = new Language({
      languageName: req.body.languageName,
    });

    const savedLanguage = await newLanguage.save();
    return res.status(200).json({ message: "Successfully Added" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllLanguages = async (req, res, next) => {
  try {

  
    const allLanguages = await Language.find();


    return res.status(200).json({ result:allLanguages }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteLanguage = async (req, res, next) => {
  try {


    if(!req.params.id){
      return res.status(400).json({ message: "Id is Required!" }).end();
    }
  
   await Language.findByIdAndDelete(req.params.id);


    return res.status(200).json({ message:`Successfully deleted` }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const updateLanguage = async (req, res, next) => {
  try {

  
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingBanner = await Language.findByIdAndUpdate(req.params.id,{$set:{
      languageName: req.body.languageName
    }});

    if (!existingBanner) {
      return res.status(400).json({ message: "Language Not Exist!!" }).end();
    }

   
    return res
      .status(200)
      .json({ message: "Successfully Updated" })
      .end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};






// countries

export const createCountry = async (req, res, next) => {
  try {

    if(!req.body.countryName){
      return res.status(400).json({ message: "Country Name is Required!" }).end();
    }

    const newCountry = new Country({
      countryName: req.body.countryName,
    });

    const savedCountry = await newCountry.save();
    return res.status(200).json({ message: "Successfully Added" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllCountries = async (req, res, next) => {
  try {

  
    const allCountries = await Country.find();


    return res.status(200).json({ result:allCountries }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteCountry = async (req, res, next) => {
  try {


    if(!req.params.id){
      return res.status(400).json({ message: "Id is Required!" }).end();
    }
  
   await Country.findByIdAndDelete(req.params.id);


    return res.status(200).json({ message:`Successfully deleted` }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const updateCountry = async (req, res, next) => {
  try {

  
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingCountry = await Country.findByIdAndUpdate(req.params.id,{$set:{
      countryName: req.body.countryName
    }});

    if (!existingCountry) {
      return res.status(400).json({ message: "Country Not Exist!!" }).end();
    }

   
    return res
      .status(200)
      .json({ message: "Successfully Updated" })
      .end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};