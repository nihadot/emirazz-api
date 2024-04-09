import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ClientLogo from "../model/ClientLogo.js";


export const create = async (req, res, next) => {
  try {
    const newClient = new ClientLogo(req.body);
    const savedClient = await newClient.save();
    return res.status(200).json({ result: savedClient }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getClientLogos = await ClientLogo.find();

    return res.status(200).json({ result: getClientLogos }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const editById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingClientLogo = await ClientLogo.findById(req.body._id);

    if (!existingClientLogo) {
      return res.status(400).json({ message: "Banner logo Not Exist!!" }).end();
    }

    await ClientLogo.findByIdAndUpdate(req.body._id, { $set: req.body });

    return res.status(200).json({ message: "Successfully Updated" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id Not Provided!" }).end();
    }

    const existingClientLogo = await ClientLogo.findById(req.params.id);

    if (!existingClientLogo) {
      return res.status(400).json({ message: "CLient logo Not Exist!!" }).end();
    }

    await ClientLogo.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};