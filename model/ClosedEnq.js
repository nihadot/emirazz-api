import { Schema, model } from "mongoose";

const ClosedEnqSchema = new Schema({
    enqId:{
        type:String,
    },
    agentId: {
        type: String,
    },
    view:{
        type: Boolean,
        default: false,
    },
    nationality:{

        type: String,
    },
    passportNumber:{
        type: String,
    },
    email:{
        type: String,
    },
    totalAmount:{
        type: Number,
    },
    reason :{
        type: String,
    }
}, { timestamps: true });

const ClosedEnq = model("closed-enq", ClosedEnqSchema);

export default ClosedEnq;



