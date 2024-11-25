import { Schema, model } from "mongoose";

const CitySchema = new Schema(
  {
    cityName: {
      type: String,
      required: [true, "City name is required"],
      minlength: [3, "City name must be at least 3 characters long"],
      trim: true,
    },
    emirateName: {
      type: String,
      required: [true, "Emirate name is required"],
      minlength: [3, "Emirate name must be at least 3 characters long"],
      trim: true,
    },
    imageFile: {
      type: {
        public_id: { type: String, required: [true, "Image public_id is required"] },
        secure_url: { type: String, required: [true, "Secure URL is required"] },
        url: { type: String, required: [true, "Image URL is required"] },
        bytes: { type: Number, min: [1, "Image size must be greater than 0"] },
        width: { type: Number, min: [1, "Image width must be greater than 0"] },
        height: { type: Number, min: [1, "Image height must be greater than 0"] },
      },
      default: {
        public_id: "",
        url: "",
        secure_url: "",
        bytes: 0,
        width: 0,
        height: 0,
      },
    },
    priorityExists:{
        type: Boolean,
        default: false,
  
    },
    priority: {
      type: Number, // Optional field
    },
  },
  { timestamps: true }
);

const City = model("City", CitySchema);

export default City;






import Joi from "joi";

export const addingCityValidationSchema = Joi.object({
  cityName: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.base": "City name must be a string",
      "string.empty": "City name cannot be empty",
      "string.min": "City name must be at least 3 characters long",
      "any.required": "City name is required",
    }),
  emirateName: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.base": "Emirate name must be a string",
      "string.empty": "Emirate name cannot be empty",
      "string.min": "Emirate name must be at least 3 characters long",
      "any.required": "Emirate name is required",
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
