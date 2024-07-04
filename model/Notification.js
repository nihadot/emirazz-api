import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    title:{
        type:String,
    },
    description: {
        type: String,
    },
    mainImgaeLink: {
        type: String,
    },
}, { timestamps: true });

const Notification = model("Notification", NotificationSchema);

export default Notification;



