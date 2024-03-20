import { Schema, model } from "mongoose";

const BannerSchema = new Schema({
    bannerHeadline:{
        type:String,
    },
    bannerSubtext: {
        type: String,
    },
    buttonText: {
        type: String,
    },
    buttonLink:{
        type:String
    },
    mainImgaeLink:{
        type:String
    }
}, { timestamps: true });

const Banner = model("Banner", BannerSchema);

export default Banner;



