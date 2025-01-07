import mongoose, { Schema, model } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10,15}$/, // Optional: Regex for phone number validation (10-15 digits)
    },
    
    message: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true } // Automatically manage `createdAt` and `updatedAt`
);

const Contact = model("Contact", ContactSchema);

export default Contact;
