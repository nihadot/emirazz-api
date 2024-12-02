import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
    title:{
        type:String,
    },
    imageFile: {
        type: Object,
    },
    project:{
        type: Schema.Types.ObjectId,
    }
}, { timestamps: true });

const Notification = model("Notification", NotificationSchema);

export default Notification;



