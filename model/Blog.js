import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    blogTitleAr: {
      type: String,
      required: true,
    },
    blogDescription: {
      type: String,
      required: true,
    },
    blogDescriptionAr: {
      type: String,
      required: true,
    },
    blogDate: {
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
      required: true,
    },
    seoDescriptionAr: {
      type: String,
      required: true,
    },
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
    slugNameEn:{
        type: String,
        required: true,
        unique: true,
    },
    slugNameAr:{
        type: String,
        required: true,
        unique: true,
    },
    isDelete:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const BlogModel = model("Blog", BlogSchema);

export default BlogModel;
