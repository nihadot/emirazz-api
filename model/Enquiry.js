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
        enum:["qualified","not-interested","agent","interested","in-progress","closed","newlead","wrong-number","in-progressive"],
        default:"newlead"
    },
    note:{
        type: String,
    },
    isLocked:{
        type:Boolean,
        default:false
    },
    assignedTo:{
        type: mongoose.Types.ObjectId,
    },
    closedEnqId:{
        type: mongoose.Types.ObjectId,
        ref:"ClosedEnq"
    },
    duplicateEnquiry:{
        type:String,
    }
}, { timestamps: true });

const Enquiry = model("Enquiry", enquirySchema);

export default Enquiry;



