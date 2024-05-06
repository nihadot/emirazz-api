import { Schema, model } from "mongoose";

const SideBannerSchema = new Schema(
  {
    mainImgaeLink: {
      type: String,
    },
  },
  { timestamps: true }
);

const SideBannerLogo = model("SideBannerLogo", SideBannerSchema);

export default SideBannerLogo;
