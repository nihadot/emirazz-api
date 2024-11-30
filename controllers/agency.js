import { deleteFile } from "../middleware/deleteFile.js";
import AgencyModel from "../model/Agency.js";
import bcrypt from "bcrypt";
import Property from "../model/Property.js";
import AssignedModel from "../model/AssigendProjects.js";
import Enquiry from "../model/Enquiry.js";
import mongoose from "mongoose";
import Agency from "../model/Agency.js";
import  jwt  from "jsonwebtoken";

export const createAgency = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;

    if (!password || !username || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required!" })
        .end();
    }

    const existMail = await AgencyModel.findOne({ username });

    if (existMail) {
      return res.status(400).json({ message: "Mail-ID Exist!" }).end();
    }


    const newAgency = new AgencyModel({ username, password, name });

    const savedAgency = await newAgency.save();

    const { password: pwd, ...otherDetails } = savedAgency._doc;

    const user = {
      ...otherDetails,
    };

    return res.status(200).json({ result: user }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAllAgency = async (req, res, next) => {
  try {
    const getAgencies = await AgencyModel.find();

    return res.status(200).json({ result: getAgencies }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
export const getAllAgencyById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const getAgencies = await AgencyModel.findById(req.params.id);

    const {  ...otherDetails } = getAgencies._doc;

    const user = {
      ...otherDetails,
    };

    return res.status(200).json({ result: user }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editAgencyById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingAgency = await AgencyModel.findById(req.params.id);

    if (!existingAgency) {
      return res.status(400).json({ message: "Item Not Exist!!" }).end();
    }

    const updateData = { ...req.body };


    const data = await AgencyModel.findByIdAndUpdate(
      req.params.id, // Ensure 'id' matches your route parameter
      { $set: updateData },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Agency not found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully Updated", result: data });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteAgencyById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingAgency = await AgencyModel.findByIdAndDelete(req.params.id);

    if (!existingAgency) {
      return res.status(400).json({ message: "Banner Not Exist!!" }).end();
    }

    await AgencyModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const assignedByAgency = async (req, res, next) => {
  try {
    const { agencyId, leadId } = req.body;



    console.log('[BODY]:',req.body)
    if (!agencyId || !leadId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    // if exist the lead to change the status

    // const isExistAssignedLead = await AssignedModel.findOne({
    //   leadId: new mongoose.Types.ObjectId(leadId),
    // });

    // console.log('[isExistAssignedLead]: ',isExistAssignedLead)

    // if (isExistAssignedLead) {
    //   if (req.body.agencyId === "none") {
    //     await AssignedModel.findByIdAndUpdate(isExistAssignedLead._id, {
    //       $unset: {
    //         agencyId: 1, // Unset the `agencyId` field
    //       },
    //     });
    //   } else {
    //     // to change the leade by body agencyId
    //     await AssignedModel.findByIdAndUpdate(isExistAssignedLead._id, {
    //       $set: {
    //         agencyId,
    //       },
    //     });
    //   }
    //   return res.status(200).json({ message: "Successfully Assigned" }).end();
    // }
    // if (req.body.agencyId === "none") {
    //   return res.status(400).json({ message: "Lead Not Exist!!" }).end();
    // }

    if(agencyId === "none"){
     await Enquiry.findByIdAndUpdate(leadId,{$unset:{assignedTo:agencyId}});
    return res.status(200).json({ message: "Successfully Assigned" }).end();

    }

    const existingAgency = await AgencyModel.findById(agencyId);

    if (!existingAgency) {
      return res.status(400).json({ message: "Agency Not Exist!!" }).end();
    }

    const existingLead = await Enquiry.findById(leadId);

    if (!existingLead) {
      return res.status(400).json({ message: "Lead Not Exist!!" }).end();
    }

    // const newAssigned = new AssignedModel({ leadId, agencyId });

    // await newAssigned.save();

    await Enquiry.findByIdAndUpdate(leadId,{$set:{assignedTo:agencyId}});


    return res.status(200).json({ message: "Successfully Assigned" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};


export const loginAgency = async (req, res, next) => {

  const { username, password } = req.body;

  if (!password || !username) {
    return res.status(400).json({message:'All fields are required!'}).end();
  }

  try {
    const existUser = await AgencyModel.findOne({ username,password });

    if(!existUser) return res.status(400).json({message:'Agency is not founded!'}).end();

  

    const { isAdmin, ...otherDetails } = existUser._doc;

    const accessToken = jwt.sign(
      { id: existUser._id, isAgency: existUser.isAgency },
      process.env.JWT_SECRET,
      { expiresIn: "30 days" }
    );

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   secure: true, // Ensures the cookie is sent only over HTTPS connections
    //   sameSite: 'None' // Allows the cookie to be sent in cross-origin requests
    // }); //30 days valid

    return res.status(200).json({ result:otherDetails,token:accessToken})

  } catch (error) {
    
    return res.status(400).json({message: error.message || 'Internal server error!'}).end();

  }
};