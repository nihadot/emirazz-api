import { Schema, model } from "mongoose";

const BannerSchema = new Schema({
    mainImgaeLink:{
        type:String
    }
}, { timestamps: true });

const ClientLogo = model("ClientLogo", BannerSchema);

export default ClientLogo;



