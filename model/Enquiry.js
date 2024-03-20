import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const enquirySchema = new Schema({
    propertyId:{
        type: mongoose.Types.ObjectId,
    },
    name: {
        type: String,
    },
    number: {
        type: String,
    },
}, { timestamps: true });

const Enquiry = model("Enquiry", enquirySchema);

export default Enquiry;



