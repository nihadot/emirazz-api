import BannerModel from "../model/Banner.js";

export const create = async (req, res, next) => {
  try {
    const newBanner = new BannerModel(req.body);
    const savedBanner = await newBanner.save();
    return res.status(200).json({ result: savedBanner }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getAll = async (req, res, next) => {
  try {
    const getBanners = await BannerModel.find();

    return res.status(200).json({ result: getBanners }).end();
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

    const existingBanner = await BannerModel.findById(req.body._id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner Not Exist!!" }).end();
    }

    await BannerModel.findByIdAndUpdate(req.body._id, { $set: req.body });

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

    const existingBanner = await BannerModel.findByIdAndDelete(req.params.id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner Not Exist!!" }).end();
    }

    await BannerModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Successfully Deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};