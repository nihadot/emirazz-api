import mongoose, { Schema, model } from "mongoose";

const CountsSchema = new Schema({
    countOfBlogs:{
        type:Number,
    },
    countOfPartners: {
        type: Number,
    },
    countOfProducts: {
        type: Number,
    },
    countOfNews: {
        type: Number,
    },
    countOfGallery: {
        type: Number,
    },

}, { timestamps: true });

const Counts = model("counts", CountsSchema);

export default Counts;



