import { Schema, model } from "mongoose";

const AgencySchema = new Schema({
    name:{
        type:String,
    },
    email: {
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
}, { timestamps: true });

const Agency = model("Agency", AgencySchema);

export default Agency;



