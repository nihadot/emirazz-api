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
}, { timestamps: true });

const Blog = model("Blog", BlogSchema);

export default Blog;



