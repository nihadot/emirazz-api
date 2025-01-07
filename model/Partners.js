import { Schema, model } from "mongoose";

const PartnersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageLink: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      url: { type: String, required: true },
      bytes: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PartnersModel = model("Partners", PartnersSchema);

export default PartnersModel;
