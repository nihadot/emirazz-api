import { Schema, model } from "mongoose";

const SideBannerSchema = new Schema(
  {
    imageFile: 
      { 
          asset_id: { type: String },
          secure_url: { type: String },
          url: { type: String },
          public_id: { type: String },
      },
      landScape:{
        asset_id: { type: String },
        secure_url: { type: String },
        url: { type: String },
        public_id: { type: String },
      },
    name: {
      type: String,
    },
  
  },
  { timestamps: true }
);

const SideBannerLogo = model("SideBannerLogo", SideBannerSchema);

export default SideBannerLogo;
