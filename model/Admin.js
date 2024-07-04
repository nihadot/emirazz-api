import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Admin = model("Admin", AdminSchema);

export default Admin;



