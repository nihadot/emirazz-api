import { Schema, model } from "mongoose";

const BlogSchema = new Schema({
    blogBody:{
        type:String,
    },
    blogTitle: {
        type: String,
    },
    mainImgaeLink: {
        type: String,
    },
    date: {
        type: Date,
    },
}, { timestamps: true });

const Blog = model("Blog", BlogSchema);

export default Blog;



