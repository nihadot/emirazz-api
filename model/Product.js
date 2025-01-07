import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    productTitle: {
      type: String,
      required: true,
    },
    productTitleAr: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productDescriptionAr: {
      type: String,
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
     // New Fields
     productDetails: {
      type: String,
      required: true,
    }, // English name details
    productDetailsAr: {
      type: String,
      required: true,
    }, // Arabic name details
  },
  { timestamps: true }
);

const ProductModel = model("Product", ProductSchema);

export default ProductModel;
