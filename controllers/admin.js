import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../model/Admin.js";
import { validationResult } from 'express-validator';



export const login = async (req, res, next) => {

  try {
    const errors = validationResult(req);

    // If validation fails, return errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;


    // First, check if the username or email exists in the database
    const user = await AdminModel.findOne({ $or: [{ username }, { email: username }] });

    if (!user) {
      return res.status(400).json({ message: 'User not found!' }).end();
    }

    // Extract only the necessary fields from the user document
    const { password: storedPassword, isAdmin, username: dbUsername, email, profileImage, name } = user;


    // console.log('Password:', password);
    // console.log('Stored Password:', storedPassword);
    // bcrypt.compareSync(myPlaintextPassword, 10); // true
// bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
    // Compare the hashed password with the stored one
    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong username or password!' }).end();
    }


    // Create access token (JWT)
    const accessToken = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Access token expires in 30 seconds hour
    );

    // Create refresh token (JWT)
    // const refreshToken = jwt.sign(
    //   { id: user._id, isAdmin },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' } // Refresh token expires in 7 days
    // );


    // Store the refresh token in an HTTP-only cookie
    // res.cookie('refreshToken', refreshToken, {
    //   expires: new Date(Date.now() * 90 * 24 * 60 * 60 * 1000), // 7 days expiry
    //   httpOnly: true,
    //   sameSite: 'none', // Allows the cookie to be sent in cross-origin requests
    //   secure: true, // Ensures the cookie is sent only over HTTPS
    // });

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    // });

    const data = {
      name,
      username:dbUsername,
      profileImage,
      email,
    }

    // Response with the user details and the access token
    return res.status(200).json({
      result: data,
      token: accessToken,
    });


  } catch (error) {

    return res.status(400).json({ message: error.message || 'Internal server error!' }).end();

  }
};


// {
//   "email":"emiraaz@gmail.com",
//   "username":"emiraaz@admin",
//   "password":"Emiraaz@123#",
//   "isAdmin":false,
//   "name":"Admin"
// }

export const register = async (req, res, next) => {

  const { username,email, password, isAdmin=true, name } = req.body;

  if (!password || !username || !email) {
    return res.status(400).json({message:'All fields are required!'}).end();
  }

  const existMail = await AdminModel.findOne({ $or: [{ username }, { email: username }] });

  if(existMail){
    return res.status(400).json({message: 'Username Exist!'}).end();
  }

  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = bcrypt.hashSync(password, salt);

  const newAdmin = new AdminModel({ username,email, password: hash, isAdmin, name });

  try {
    const savedAdmin = await newAdmin.save();

    const { password, isAdmin, ...otherDetails } = savedAdmin._doc;

    res.status(200).json({result:otherDetails}).end();
  } catch (error) {

    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};