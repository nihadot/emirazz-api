import { Schema, model } from "mongoose";

const CountrySchema = new Schema({
    countryName:{
        type:String,
    },
   
}, { timestamps: true });

const Country = model("Country", CountrySchema);

export default Country;



