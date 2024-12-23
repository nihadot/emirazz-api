import mongoose, { Schema, model } from "mongoose";

const FeedBackSchema = new Schema({
    feedback:{
        type:String,
    },
  
}, { timestamps: true });

const Feedback = model("Feedback", FeedBackSchema);

export default Feedback;



