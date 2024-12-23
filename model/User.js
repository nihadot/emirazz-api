import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name:{
        type:String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isUser: {
        type: Boolean,
        default: true,
    },
  
}, { timestamps: true });

const User = model("User", UserSchema);

export default User;



