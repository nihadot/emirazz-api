import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../model/Admin.js";
import Agency from "../model/Agency.js";
import Blog from "../model/Blog.js";
import City from "../model/City.js";
import Developer from "../model/Developer.js";
import Enquiry from "../model/Enquiry.js";
import Property from "../model/Property.js";
import ClosedEnq from "../model/ClosedEnq.js";

export const register = async (req, res, next) => {

  const { email, password, isAdmin=true, name } = req.body;

  if (!password || !email) {
    return res.status(400).json({message:'All fields are required!'}).end();
  }

  const existMail = await AdminModel.findOne({email})

  if(existMail){
    return res.status(400).json({message: 'Mail-ID Exist!'}).end();
  }

  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = bcrypt.hashSync(password, salt);

  const newAdmin = new AdminModel({ email, password: hash, isAdmin, name });

  try {
    const savedAdmin = await newAdmin.save();

    const { password, isAdmin, ...otherDetails } = savedAdmin._doc;

    res.status(200).json({result:otherDetails}).end();
  } catch (error) {

    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};

export const login = async (req, res, next) => {

  const { email, password } = req.body;
  console.log(email,password)

  if (!password || !email) {
    return res.status(400).json({message:'All fields are required!'}).end();
  }

  try {
    const existMail = await AdminModel.findOne({ email });

    if(!existMail) return res.status(400).json({message:'User is not founded!'}).end();

    const isPassword = await bcrypt.compare(req.body.password, existMail.password);

    if(!isPassword) return res.status(400).json({message:'Wrong username or password!'}).end();

    const { password, isAdmin, ...otherDetails } = existMail._doc;

    const accessToken = jwt.sign(
      { id: existMail._id, isAdmin: existMail.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30 days" }
    );

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   secure: true, // Ensures the cookie is sent only over HTTPS connections
    //   sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
    // }); //30 days valid

    return res.status(200).json({ result:otherDetails,token:accessToken})

  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};


// Get Admin
export const getAdmin = async (req, res, next) => {

  try {
      const getAdmin = await AdminModel.findById(req.user.id);

      if(!getAdmin) return res.status(401).json({message:'Not found!'}).end();
      
      return res.status(200).json({ result:getAdmin }).end();
   
  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};





export const getAllCountAll = async (req, res, next) => {

  try {

    const obj = {
      agency: 0,
      blog: 0,
      cities: 0,
      developer: 0,
      enquiries:0,
      projects: 0,
    }
      const getAgency = await Agency.countDocuments();
      const getBlog = await Blog.countDocuments();
      const getCity = await City.countDocuments();
      const getDeveloper = await Developer.countDocuments();
      const getEnquiries = await Enquiry.countDocuments();
      const getProperty = await Property.countDocuments();


      obj.blog = getBlog;
      obj.enquiries = getEnquiries;
      obj.cities = getCity;
      obj.agency = getAgency;
    obj.developer = getDeveloper;
    obj.projects = getProperty;

   

      
      return res.status(200).json({ result:obj }).end();
   
  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};


export const UpdateClosedEnquiry = async (req, res, next) => {

  try {

   if(!req.params.id){
     return res.status(400).json({message:'Id is required!'}).end();
   }



  const savedClosedEnq =  await ClosedEnq.findByIdAndUpdate(req.params.id,{$set:{
    nationality:req.body.nationality,
    email:req.body.email,
    passportNumber:req.body.passportNumber,
    totalAmount:req.body.totalAmount,
    reason:req.body.reason,
    ...(req.body.pdfFile && { pdfFile: req.body.pdfFile }),
   }});

  
   if(!savedClosedEnq) return res.status(400).json({message:'Not found!'}).end();

   return res.status(200).json({ result:savedClosedEnq }).end();
   
  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};