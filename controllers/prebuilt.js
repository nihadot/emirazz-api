import Blog from "../model/Blog.js";
import City from "../model/City.js";
import Developer from "../model/Developer.js";
import Property from "../model/Property.js";

import slugify from "slugify";


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