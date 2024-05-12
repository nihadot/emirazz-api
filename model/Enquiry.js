import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const enquirySchema = new Schema({
    propertyId:{
        type: mongoose.Types.ObjectId,
    },
    developerId:{
        type: mongoose.Types.ObjectId,
    },  
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    status: {
        type: String,
        enum:["pending","delivered","ontheway"],
        default:"pending"
    },
}, { timestamps: true });

const Enquiry = model("Enquiry", enquirySchema);

export default Enquiry;



