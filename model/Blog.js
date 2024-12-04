import { Schema, model } from "mongoose";

const BlogSchema = new Schema({
    blogBody:{
        type:String,
    },
    blogTitle: {
        type: String,
    },
    imageFile: {
    
            asset_id: { type: String },
            secure_url: { type: String },
            url: { type: String },
            public_id: { type: String },
        
    },
    date: {
        type: Date,
    },
    slug:{
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const Blog = model("Blog", BlogSchema);

export default Blog;



