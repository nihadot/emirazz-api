import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../model/Admin.js";

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
  console.log('ee');

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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true, // Ensures the cookie is sent only over HTTPS connections
      sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
    }); //30 days valid

    return res.status(200).json({ result:otherDetails,token:accessToken,expiredTimeZone:''}).end();

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
