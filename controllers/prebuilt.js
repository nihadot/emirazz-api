import Agency from "../model/Agency.js";
import Blog from "../model/Blog.js";
import City from "../model/City.js";
import Developer from "../model/Developer.js";
import Property from "../model/Property.js";

import slugify from "slugify";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import Feedback from "../model/Feedback.js";
import PropertyCounts from "../model/PropertyCounts.js";
import { sortProjects } from "../helpers/sortProjects.js";

export const syncAllProjectSlug = async(req,res)=>{
    try {

       
         // Fetch all projects from the database
    const projects = await Property.find();

    // Iterate through each project and check if slug exists
    const updatedProjects = [];
    
    for (let project of projects) {
      if (!project.slug) {  // If the slug doesn't exist
        const slug = slugify(project.projectTitle, { lower: true });

        
        // Update the project with the generated slug
        project.slug = slug;
        
        // Save the project back to the database
        await project.save();
        
        updatedProjects.push(project);
      }
    }

    // Return success response with the updated projects
    return res.status(200).json({
      message: "Slugs synchronized successfully!",
    });


      }catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }

}



export const syncAllCitiesSlug = async(req,res)=>{
    try {

       
         // Fetch all cities from the database
    const cities = await City.find();

    // Iterate through each project and check if slug exists
    const updatedCities = [];
    
    for (let city of cities) {
      if (!city.slug) {  // If the slug doesn't exist
        const slug = slugify(city.cityName, { lower: true });

        
        // Update the city with the generated slug
        city.slug = slug;
        
        // Save the city back to the database
        await city.save();
        
        updatedCities.push(city);
      }
    }

    // Return success response with the updated cities
    return res.status(200).json({
      message: "Slugs synchronized successfully!",
    });


      }catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }

}


export const syncAllBlogSlug = async(req,res)=>{
    try {

       
         // Fetch all blogs from the database
    const blogs = await Blog.find();

    // Iterate through each project and check if slug exists
    const updatedBlog = [];
    
    for (let blog of blogs) {
      if (!blog.slug) {  // If the slug doesn't exist
        const slug = slugify(blog.blogTitle, { lower: true });

        
        // Update the blog with the generated slug
        blog.slug = slug;
        
        // Save the blog back to the database
        await blog.save();
        
        updatedBlog.push(blog);
      }
    }

    // Return success response with the updated blog
    return res.status(200).json({
      message: "Slugs synchronized successfully!",
    });


      }catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }

}


export const syncAllDevelopersSlug = async(req,res)=>{
    try {

       
         // Fetch all developers from the database
    const developers = await Developer.find();

    // Iterate through each project and check if slug exists
    const updatedDeveloper = [];
    
    for (let developer of developers) {
      if (!developer.slug) {  // If the slug doesn't exist
        const slug = slugify(developer.developerName, { lower: true });

        
        // Update the developer with the generated slug
        developer.slug = slug;
        
        // Save the developer back to the database
        await developer.save();
        
        updatedDeveloper.push(developer);
      }
    }

    // Return success response with the updated blog
    return res.status(200).json({
      message: "Slugs synchronized successfully!",
    });


      }catch (error) {
        return res
          .status(400)
          .json({ message: error.message || "Internal server error!" })
          .end();
      }

}


export const signup = async(req,res)=>{

// console.log(req.body);
// return true;
  const { email, name,password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({message:'All fields are required!'}).end();
  }

  try {
    const existUser = await User.findOne({ email });

    if(existUser) return res.status(400).json({message:'User is existing, You can login now'}).end();

    const newUser = new User({ name,email,password });

    const savedUser = await newUser.save();


    // const { isAdmin, ...otherDetails } = existUser._doc;

  

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   secure: true, // Ensures the cookie is sent only over HTTPS connections
    //   sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
    // }); //30 days valid

    return res.status(200).json({ message:"User is created ,You can login now"})

  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }

}


export const login = async(req,res)=>{

  // console.log(req.body);
  // return true;
    const { email,password } = req.body;
  
    if (!email || !password ) {
      return res.status(400).json({message:'All fields are required!'}).end();
    }
  
    try {
      const existUser = await User.findOne({ email });
  
      if(!existUser) return res.status(400).json({message:'User not existing!'}).end();
  
      const existingPassword = await User.findOne({ password });
      if(!existingPassword) return res.status(400).json({message:'User not existing!'}).end();

     
   
      const accessToken = jwt.sign(
        { id: existUser._id, isUser: existUser.isUser },
        process.env.JWT_SECRET,
        { expiresIn: "30 days" }
      );
  
      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   secure: true, // Ensures the cookie is sent only over HTTPS connections
      //   sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
      // }); //30 days valid
  
      return res.status(200).json({ result:existUser,message:"logged",token:accessToken})
  
    } catch (error) {
      
      return res.status(400).json({message: error.message || 'Internal server error!'}).end();
  
    }
  
  }

  
  export const updateUserAPI = async(req,res)=>{

   
    // console.log(req.body);
    // return true;
      const { email,name } = req.body;
    
      if (!email || !name ) {
        return res.status(400).json({message:'All fields are required!'}).end();
      }
    
      try {
        // const existUser = await User.findOne({ email });
    
        // if(!existUser) return res.status(400).json({message:'User not existing!'}).end();
    
      // console.log(req.user)
    
      // return true;
        const existingUser = await User.findByIdAndUpdate(req.user.id,{ $set:{
          ...(req.body.name && {name:name}),
          ...(req.body.email && {email:email}),
        } },{new:true});
        if(!existingUser) return res.status(400).json({message:'User not existing!'}).end();
  
       
     
        // const accessToken = jwt.sign(
        //   { id: existUser._id, isUser: existUser.isUser },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "30 days" }
        // );
    
        // res.cookie("accessToken", accessToken, {
        //   httpOnly: true,
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        //   secure: true, // Ensures the cookie is sent only over HTTPS connections
        //   sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
        // }); //30 days valid
    
        return res.status(200).json({ result:existingUser,message:"Updated"})
    
      } catch (error) {
        
        return res.status(400).json({message: error.message || 'Internal server error!'}).end();
    
      }
    
    }

    export const deleteUser = async(req,res)=>{

  
      
        try {
        //  console.log(req.user)
          // return true
          const existingUser = await User.findByIdAndDelete(req.user.id);
          if(!existingUser) return res.status(400).json({message:'User not existing!'}).end();
    
         
          return res.status(200).json({message:"User deleted successfully"})
      
        } catch (error) {
          
          return res.status(400).json({message: error.message || 'Internal server error!'}).end();
      
        }
      
      }

    

      
      export const createFeedback = async(req,res)=>{

  
      
        try {
         console.log(req.body)
          // return true
          const {feedback} = req.body;
          if(!feedback){
            return res.status(200).json({message:"Feedback is required"})

          }
          const newFeedback = new Feedback({feedback})
          await newFeedback.save();
         
          return res.status(200).json({message:"Successfully created"})
      
        } catch (error) {
          
          return res.status(400).json({message: error.message || 'Internal server error!'}).end();
      
        }
      
      }


      export const updateDBCount = async(req,res)=>{
        try {
         

          const villa = await Property.countDocuments({ propertyType: "villa" });
          const apartment = await Property.countDocuments({ propertyType: "apartment" });
          const townhouse = await Property.countDocuments({ propertyType: "townhouse" });
          const penthouse = await Property.countDocuments({ propertyType: "penthouse" });
          const newCollection = new PropertyCounts({
            apartment,penthouse,
            townhouse,villa
          })

          const saved = newCollection.save();

           return res.status(200).json({message:"Job is completed"})
       
         } catch (error) {
           
           return res.status(400).json({message: error.message || 'Internal server error!'}).end();
       
         }
      }



      

export const getTheWholeCountPropertyType = async (req, res, next) => {
  try {
   

    const result = await PropertyCounts.find();
  
  
  

    // const getCitiesWithCount = await fetchCitiesAndCount(getCities,true);

    const sortedItems = sortProjects(result)
// console.log(sortedItems,'sortedItems')
    return res.status(200).json({ result:  sortedItems[0] }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};