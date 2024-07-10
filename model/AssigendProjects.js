import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const assignedProjectsSchema = new Schema({
    leadId:{
        type: mongoose.Types.ObjectId,
    },
    agencyId:{
        type: mongoose.Types.ObjectId,
    },  
}, { timestamps: true });

const AssignedModel = model("AssignedProjects", assignedProjectsSchema);

export default AssignedModel;



