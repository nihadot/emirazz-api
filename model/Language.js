import { Schema, model } from "mongoose";

const LanguageSchema = new Schema({
    languageName:{
        type:String,
    },
   
}, { timestamps: true });

const Language = model("Language", LanguageSchema);

export default Language;



