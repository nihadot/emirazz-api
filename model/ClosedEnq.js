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
    },
    pdfFile: {
    
        asset_id: { type: String },
        secure_url: { type: String },
        url: { type: String },
        public_id: { type: String },
    
},
view:{
    type: Boolean,
    default: false,
}
}, { timestamps: true });

const ClosedEnq = model("closed-enq", ClosedEnqSchema);

export default ClosedEnq;



