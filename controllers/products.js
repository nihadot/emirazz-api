import ProductModel from "../model/Product.js";
import slugify from "slugify";
import Counts from "../model/counts.js";

export const createNewProduct = async (req, res, next) => {
  try {
    const {
      productTitle,
      productTitleAr,
      productDescription,
      productDescriptionAr,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
      productDetails,
      productDetailsAr,
    } = req.body;

    if (!imageLink) {
      return res.status(400).json({ message: "Image not provided" }).end();
    }

    // Create slug URLs
    const slugNameEn = slugify(req.body.productTitle, { lower: true });
    const slugNameAr = slugify(req.body.productTitleAr, { lower: true });

    const isSlugEn = await ProductModel.findOne({ slugNameEn: slugNameEn });
    const isSlugAr = await ProductModel.findOne({ slugNameAr: slugNameAr });

    if (isSlugEn || isSlugAr) {
      return res.status(400).json({ message: "Titles already exist" }).end();
    }

    // Create a new product instance
    const newProduct = new ProductModel({
      productTitle,
      productTitleAr,
      productDescription,
      productDescriptionAr,
      productDetails,
      productDetailsAr,
      seoTitle,
      seoTitleAr,
      seoDescription,
      seoDescriptionAr,
      seoKeywords,
      seoKeywordsAr,
      imageLink,
      slugNameAr,
      slugNameEn,
    });

    // Save to the database
    const savedProduct = await newProduct.save();

    const isCount = await Counts.findOne({});
    if (isCount) {
      if (isCount.countOfProducts) {
        isCount.countOfProducts = (isCount.countOfProducts) + 1;
      } else {
        isCount.countOfProducts = 1;
      }
      await isCount.save();
    } else {
      new Counts({ countOfProducts: 1 }).save();
    }
    

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: savedProduct,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Internal server error!" })
      .end();
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const skip = (page - 1) * limit;

    // Fetch products sorted by date (descending) and exclude `createdAt`
    const products = await ProductModel.find({ isDelete: false }, { createdAt: 0 })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalCount = await Counts.findOne();

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    return res
      .status(400)
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
