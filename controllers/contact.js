import ProductModel from "../model/Product.js";
import slugify from "slugify";
import Counts from "../model/counts.js";
import ContactModel from "../model/ContactModel.js"
export const createNewContact = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, message } = req.body;

    console.log(req.body)
    // Validate mandatory fields
    if (!firstName || !lastName || !phoneNumber || !message) {
      return res.status(400).json({ message: "All fields are required." }).end();
    }

    // Check if a similar contact exists (optional logic, based on requirements)
    const existingContact = await ContactModel.findOne({
      firstName,
      lastName,
      phoneNumber,
    });

    if (existingContact) {
      return res
        .status(400)
        .json({ message: "This contact already exists in the system." })
        .end();
    }

    // Create a new contact instance
    const newContact = new ContactModel({
      firstName,
      lastName,
      phoneNumber,
      message,
    });

    // Save to the database
    const savedContact = await newContact.save();

   
    res.status(201).json({
      success: true,
      message: "Contact submitted successfully!",
      data: savedContact,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const fetchContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    // Fetch contacts sorted by date (descending)
    const contacts = await ContactModel.find({}, { createdAt: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count of contacts
    const totalCount = await ContactModel.countDocuments();

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    if (!req.params.slug) {
      return res.status(400).json({ message: "Slug not provided" });
    }

    const result = await ProductModel.findOne({ slugNameEn: req.params.slug });

    if (!result) {
      return res.status(400).json({ message: "Product not available" });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const updateProductBySlug = async (req, res) => {
  try {
    if (!req.params.slug) {
      return res.status(400).json({ message: "Slug not provided" });
    }

    const result = await ProductModel.findOne({ slugNameEn: req.params.slug });

    if (!result) {
      return res.status(400).json({ message: "Product not available" });
    }

    if (!result.imageLink) {
      return res.status(400).json({ message: "Image not provided" }).end();
    }

    const data = {
      ...req.body,
    };

    await ProductModel.findByIdAndUpdate(result._id, { $set: { ...data } });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const deleteProductById = async (req, res, next) => {
  try {
    if (!req.params.productId) {
      return res.status(400).json({ message: "ID not provided!" }).end();
    }

    const existingProduct = await ProductModel.findById(req.params.productId);

    if (!existingProduct) {
      return res.status(400).json({ message: "Product not exist!" }).end();
    }

    await ProductModel.findByIdAndUpdate(req.params.productId, { $set: { isDelete: true } });

    const isCount = await Counts.findOne({});
    if (isCount && isCount.countOfProducts !== 0) {
      isCount.countOfProducts = isCount.countOfProducts - 1;
      await isCount.save();
    }

    return res.status(200).json({ message: "Successfully deleted" }).end();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};
