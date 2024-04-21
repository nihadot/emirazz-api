import mongoose, { Schema, model } from "mongoose";

const PropertySchema = new Schema({
    propretyHeadline:{
        type:String,
    },
    price: {
        type: String,
    },
    beds: {
        type: String,
    },
    handoverDate: {
        type: String,
    },
    googleMapLink: {
        type: String,
    },
    address:{
        type:String,
    },
    propertyType:{
        type:[Schema.Types.ObjectId],
    },
    mainImgaeLink: {
        type: String,
    },
    videoLink: {
        type: String,
    },
    smallImage:[{
        image:{
            type:String
        }
    }],
    facilities: [{
        value:String
    }],
    paymentPlan: [{
        value:String
    }],
    areasNearBy: [{
        value:{
            type:String
        }
    }],
    description:{
        type:String
    },
    developerRef:{
        type: Schema.Types.ObjectId
    },
    cityRef:{
        type: Schema.Types.ObjectId
    }
}, { timestamps: true });

const Property = model("Property", PropertySchema);

export default Property;



