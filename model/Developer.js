import Joi from "joi";
import { Schema, model } from "mongoose";

const DeveloperSchema = new Schema({
    developerName:{
        type:String,
    },
    password: {
        type: String,
    },
    imageFile: {
        type: {
          public_id: { type: String, required: [true, "Image public_id is required"] },
          secure_url: { type: String, required: [true, "Secure URL is required"] },
          url: { type: String, required: [true, "Image URL is required"] },
          bytes: { type: Number, min: [1, "Image size must be greater than 0"] },
          width: { type: Number, min: [1, "Image width must be greater than 0"] },
          height: { type: Number, min: [1, "Image height must be greater than 0"] },
        }
    },
    priority: {
        type: Number, // Optional field
      },
    username: {
        type: String,
    },
    priorityExists:{
        type: Boolean,
        default: false,
    }
    
    
    
}, { timestamps: true });

const Developer = model("Developer", DeveloperSchema);

export default Developer;



export const addDeveloperSchema = Joi.object({
    developerName: Joi.string()
      .required()
      .min(3)
      .max(50)
      .messages({
        "string.empty": "Developer name is required",
        "string.min": "Developer name must be at least 3 characters",
        "string.max": "Developer name cannot exceed 50 characters",
      }),
    password: Joi.string()
      .required()
      .min(8)
      .max(20)
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cannot exceed 20 characters",
      }),
    username: Joi.string()
      .required()
      .min(3)
      .max(20)
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 20 characters",
      }),
      priority: Joi
      .optional()
      .allow(null, "")
      .messages({
        "string.base": "Priority must be a string",
      }),
      imageFile: Joi.object({
        public_id: Joi.string().required().messages({
          "string.base": "Image public_id must be a string",
          "any.required": "Image public_id is required",
        }),
        secure_url: Joi.string().required().messages({
          "string.base": "Secure URL must be a string",
          "any.required": "Secure URL is required",
        }),
        url: Joi.string().required().messages({
          "string.base": "Image URL must be a string",
          "any.required": "Image URL is required",
        }),
        bytes: Joi.number().min(1).messages({
          "number.base": "Bytes must be a number",
          "number.min": "Bytes must be greater than 0",
        }),
        width: Joi.number().min(1).messages({
          "number.base": "Width must be a number",
          "number.min": "Width must be greater than 0",
        }),
        height: Joi.number().min(1).messages({
          "number.base": "Height must be a number",
          "number.min": "Height must be greater than 0",
        }),
      })
        .required()
        .messages({
          "object.base": "Image file must be an object",
          "any.required": "Image file is required",
        }),
  });
