import { Schema, model } from "mongoose";

const DeveloperSchema = new Schema({
    developerName:{
        type:String,
    },
    contactNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mainImgaeLink: {
        type: String,
    },
    priority: {
        type: String,
    },
    username: {
        type: String,
    },
    
    
    
}, { timestamps: true });

const Developer = model("Developer", DeveloperSchema);

export default Developer;



