import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    title:{
        type:String,
    },
    imageFile: {
        type: Object,
    },
}, { timestamps: true });

const Notification = model("Notification", NotificationSchema);

export default Notification;



