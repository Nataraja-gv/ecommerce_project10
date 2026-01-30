const CategoryModel = require("../models/category-model");
const ProductModel = require("../models/product-model");

const addProducts = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      product_price,
      category,
      stock,
      mrp,
    } = req.body;
    const existingProduct = await ProductModel.findOne({ product_name });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    if (
      product_name === "" ||
      product_description === "" ||
      product_price === undefined ||
      category === undefined ||
      mrp === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCategory = await CategoryModel.findById({ _id: category });

    if (!existingCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (Number(product_price) > Number(mrp)) {
      return res
        .status(400)
        .json({ message: "product price should less than MRP price" });
    }

    const productImages = req.files.length;
    if (productImages === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }
    const images = req.files.map((file) => ({
      image_link: file.location,
      image_key: file.key,
    }));

    const discountCount = ((mrp - product_price) / mrp) * 100;

    const newProduct = new ProductModel({
      product_name,
      product_description,
      product_price,
      category,
      product_images: images,
      stock,
      mrp,
      discount_percentage: Math.round(discountCount),
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editProducts = async (req, res) => {
  try {
    const productId = req.params._id;

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      product_name,
      product_description,
      product_price,
      category,
      stock,
      mrp,
      product_images,
      status,
    } = req.body;

    // Validate category ONLY if provided
    if (category) {
      const existingCategory = await CategoryModel.findById(category);
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      existingProduct.category = category;
    }
    if (Number(product_price) > Number(mrp)) {
      return res
        .status(400)
        .json({ message: "product price should less than MRP price" });
    }

    let updateImages = [];

    if (product_images) {
      let existingImages = [];
      if (typeof product_images === "string") {
        existingImages = [product_images];
      } else if (Array.isArray(product_images)) {
        existingImages = product_images;
      }

      updateImages = existingImages?.map((item) => ({
        image_link: item,
      }));
    }

    if (req.files && req.files.length > 0) {
      newImages = req.files.map((item) => ({
        image_link: item.location,
      }));
      updateImages = [...updateImages, ...newImages];
    }

    // Update fields safely
    if (product_name) existingProduct.product_name = product_name;
    if (product_description)
      existingProduct.product_description = product_description;
    if (product_price !== undefined)
      existingProduct.product_price = product_price;
    if (stock !== undefined) existingProduct.stock = stock;
    if (mrp !== undefined) existingProduct.mrp = mrp;

    // Recalculate discount
    if (existingProduct.mrp && existingProduct.product_price !== undefined) {
      existingProduct.discount_percentage = Math.round(
        ((existingProduct.mrp - existingProduct.product_price) /
          existingProduct.mrp) *
          100,
      );
    }
    existingProduct.product_images = updateImages;
    existingProduct.status = status;
    await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully",
      existingProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let limit = parseInt(req.query.page_size || 2);
    let page = parseInt(req.query.page || 1);

    limit > 15 ? 15 : limit;
    const skip = (page - 1) * limit;
    const paginationFalse = req.query.pagination !== "false";
    let allProduct_query = ProductModel.find()
      .populate("category")
      .sort({ createdAt: -1 });

    if (paginationFalse) {
      allProduct_query = allProduct_query.limit(limit).skip(skip);
    }

    const allproduct = await allProduct_query;

    const totalDocuments = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    res.status(201).json({
      message: "all products",
      totalRecords: totalDocuments,
      totalPages,
      currectPage: page,
      _payload: allproduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productID = req.params._id;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await ProductModel.findByIdAndDelete(productID);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(500).json("Product Not Found");
    }
    res.status(201).json({
      _payload: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await ProductModel.find({ category: categoryId });
    // if (!products || products.length === 0) {
    //   return res.status(404).json({ message: "Products Not Found" });
    // }
     console.log(products);
    res.status(201).json({
      _payload: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProducts,
  editProducts,
  getAllProducts,
  deleteProduct,
  getProductById,
  getProductByCategory
};
