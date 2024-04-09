import { Schema, model } from "mongoose";

const BannerSchema = new Schema({
    mainImgaeLink:{
        type:String
    }
}, { timestamps: true });

const BannerLogo = model("BannerLogo", BannerSchema);

export default BannerLogo;



