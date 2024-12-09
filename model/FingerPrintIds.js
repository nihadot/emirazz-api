import Joi from "joi";
import { Schema, model } from "mongoose";

const FingerSchema = new Schema({
    fingerId:{
        type:String,
    },
    adsId: {
        type: String,
    },
}, { timestamps: true });

const FingerIDs = model("FingerIDs", FingerSchema);

export default FingerIDs;
