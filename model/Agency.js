import mongoose, { Schema, model } from "mongoose";

const AgencySchema = new Schema({
    name:{
        type:String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAgency: {
        type: Boolean,
        default: true,
    },
    imageFile:{
        type: Object,
    },
    country:{
        type: String,
    },
    language:{
        type: [mongoose.Types.ObjectId]
    }

}, { timestamps: true });

const Agency = model("Agency", AgencySchema);

export default Agency;



