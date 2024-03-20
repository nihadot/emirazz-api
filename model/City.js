import { Schema, model } from "mongoose";

const CitySchema = new Schema({
    cityName:{
        type:String,
    },
    emirateName: {
        type: String,
    },
    mainImgaeLink: {
        type: String,
    },
}, { timestamps: true });

const City = model("City", CitySchema);

export default City;



