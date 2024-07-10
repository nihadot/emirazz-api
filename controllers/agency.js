import { deleteFile } from "../middleware/deleteFile.js";
import AgencyModel from "../model/Agency.js";
import bcrypt from "bcrypt";
import Property from "../model/Property.js";
import AssignedModel from "../model/AssigendProjects.js";
import Enquiry from "../model/Enquiry.js";
import mongoose from "mongoose";

export const createAgency = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!password || !email || !name) {
      return res
        .status(400)
        .json({ message: "All fields are required!" })
        .end();
    }

    const existMail = await AgencyModel.findOne({ email });

    if (existMail) {
      return res.status(400).json({ message: "Mail-ID Exist!" }).end();
    }

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);

    const hash = bcrypt.hashSync(password, salt);

    const newAgency = new AgencyModel({ email, password: hash, name });

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

    const { password, ...otherDetails } = getAgencies._doc;

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

    if (req.body.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(req.body.password, salt);
      updateData.password = hash;
    }

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

    if (!agencyId || !leadId) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    // if exist the lead to change the status

    const isExistAssignedLead = await AssignedModel.findOne({
      leadId: new mongoose.Types.ObjectId(leadId),
    });

    if (isExistAssignedLead) {
      console.log(req.body);
      console.log(req.body.agencyId === "none");
      if (req.body.agencyId === "none") {
        await AssignedModel.findByIdAndUpdate(isExistAssignedLead._id, {
          $unset: {
            agencyId: 1, // Unset the `agencyId` field
          },
        });
      } else {
        // to change the leade by body agencyId
        await AssignedModel.findByIdAndUpdate(isExistAssignedLead._id, {
          $set: {
            agencyId,
          },
        });
      }
      return res.status(200).json({ message: "Successfully Assigned" }).end();
    }
    if (req.body.agencyId === "none") {
      return res.status(400).json({ message: "Lead Not Exist!!" }).end();
    }

    const existingAgency = await AgencyModel.findById(agencyId);

    if (!existingAgency) {
      return res.status(400).json({ message: "Agency Not Exist!!" }).end();
    }

    const existingLead = await Enquiry.findById(leadId);

    if (!existingLead) {
      return res.status(400).json({ message: "Lead Not Exist!!" }).end();
    }

    const newAssigned = new AssignedModel({ leadId, agencyId });

    await newAssigned.save();

    return res.status(200).json({ message: "Successfully Assigned" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
