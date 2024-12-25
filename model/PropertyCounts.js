import { Schema, model } from "mongoose";

const PropertyCountsSchema = new Schema({
    week: { type: Date, required: true, default: Date.now }, // Store the week of the count
    villa: { type: Number, required: true },
    apartment: { type: Number, required: true },
    townhouse: { type: Number, required: true },
    penthouse: { type: Number, required: true },
}, { timestamps: true });

const PropertyCounts = model("PropertyCounts", PropertyCountsSchema);

export default PropertyCounts;



