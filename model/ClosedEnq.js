import { Schema, model } from "mongoose";

const ClosedEnqSchema = new Schema({
    enqId:{
        type:String,
    },
    agentId: {
        type: String,
    },
}, { timestamps: true });

const ClosedEnq = model("closed-enq", ClosedEnqSchema);

export default ClosedEnq;



