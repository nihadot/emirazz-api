import { Schema, model } from "mongoose";

const NewsSchema = new Schema(
  {
    newsTitle: {
      type: String,
      required: true,
    },
    newsTitleAr: {
      type: String,
      required: true,
    },
    newsDescription: {
      type: String,
      required: true,
    },
    newsDescriptionAr: {
      type: String,
      required: true,
    },
    newsDate: {
      type: Date,
      required: true,
    },
    seoTitle: {
      type: String,
      required: true,
    },
    seoTitleAr: {
      type: String,
      required: true,
    },
    seoDescription: {
      type: String,
      required: true,    },
    seoDescriptionAr: {
      type: String,
      required: true,    },
    seoKeywords: {
      type: String,
      required: true,
    },
    seoKeywordsAr: {
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
    slugNameEn: {
      type: String,
      required: true,
      unique: true,
    },
    slugNameAr: {
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

const NewsModel = model("News", NewsSchema);

export default NewsModel;
