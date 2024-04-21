import mongoose, { Schema, model } from "mongoose";

const PropertySchema = new Schema({
    name:{
        type:String,
    },
    mainImgaeLink: {
        type: String,
    },
    description:{
        type:String
    },
}, { timestamps: true });

const Property = model("PropertyType", PropertySchema);

export default Property;



