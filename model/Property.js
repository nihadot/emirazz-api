import mongoose, { Schema, model } from "mongoose";

const PropertySchema = new Schema({
    isSold: {
        type: Boolean,
        default: false
    },
    projectTitle: {
        type: String,
        // required: true,
    },
    priceInAED: {
        type: String,
        // required: true,
    },
    handoverDate: {
        type: Date,
        // required: true,
    },
    beds: {
        type: String,
        // required: true,
    },
    mapLink: {
        type: String,
    },
    propertyType: {
        type: [String], // Array of strings (e.g., villa, apartment)
        // required: true,
    },
    cities: [String],
    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Developer",
        // required: true,
    },
    facilities: {
        type: [String], // Array of strings
    },
    paymentOptions: {
        type: [String], // Array of strings
    },
    nearbyAreas: {
        type: [String], // Array of strings
    },
    priority: {
        type: Number,
        required: false,
    },
    priorityExists: {
        type: Boolean,
        default: false,
    },
    adsOptions: {
        type: String,
    },
    address: {
        type: String,
    },
    description: {
        type: String,
    },
    projectVideo: {
        type: String,
    },
    projectNumber: {
        type: String,
    },
    isChecked: {
        type: Boolean,
    },
    draft: {
        type: Boolean,
        default: false,
    },
    imageFile: {
        asset_id: { type: String },
        secure_url: { type: String },
        url: { type: String },
        public_id: { type: String },
    },
    imageFiles: [
        {
            asset_id: { type: String },
            secure_url: { type: String },
            url: { type: String },
            public_id: { type: String },
        },
    ],
    isSold: {
        type: Boolean,
        default: false
    },
    projectMetaDescription:{
        type: String,
    },
    projectMetaTitle:{
        type: String,
    },
    projectMetaKeywords:{
        type:String,
    }


}, { timestamps: true });

const Property = model("Property", PropertySchema);

export default Property;



