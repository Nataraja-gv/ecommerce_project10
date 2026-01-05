const { parse } = require("dotenv");
const CategoryModel = require("../models/category-model");

const addCategoryControllers = async (req, res) => {
  try {
    const { category_name, category_description } = req.body;

    if (!category_name || !category_description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const category_image = req.file;
    if (!category_image) {
      return res.status(400).json({ message: "Category image is required" });
    }

    const existingCategory = await CategoryModel.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new CategoryModel({
      category_name,
      category_description,
      category_image: {
        image_link: category_image?.location,
        image_key: category_image?.key,
      },
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: "Category added successfully",
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategoryControllers = async (req, res) => {
  try {
    const { category_id } = req?.params;
    const { category_name, category_description, status } = req.body;

    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const existingCategory = await CategoryModel.findById({ _id: category_id });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req?.file) {
      existingCategory.category_image = {
        image_link: req.file.location,
        image_key: req.file.key,
      };
    }
    if (category_name) existingCategory.category_name = category_name;
    if (category_description)
      existingCategory.category_description = category_description;
    if (status !== undefined) existingCategory.status = status;

    const updatedCategory = await existingCategory.save();
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategoryControllers = async (req, res) => {
  try {
    const { category_id } = req?.params;
    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const existingCategory = await CategoryModel.findById({ _id: category_id });
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    await CategoryModel.findByIdAndDelete({ _id: category_id });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategoriesControllers = async (req, res) => {
  try {
    let limit = parseInt(req.query.page_size) || 5;
    let page = parseInt(req.query.page) || 1;
    limit = limit > 15 ? 15 : limit;
    const skip = (page - 1) * limit;
    const paginationFalse = req.query.pagination !== "false";
     let categories_query = CategoryModel.find();

    if (paginationFalse) {
      categories_query = categories_query.limit(limit).skip(skip);
    }

    const categories = await categories_query;
    const totalRecords = await CategoryModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);
   res.status(200).json({
      currectPage: page,
      recordPerPage: limit,
      totalRecords: totalRecords,
      totalPages,
      _payload: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addCategoryControllers,
  updateCategoryControllers,
  deleteCategoryControllers,
  getAllCategoriesControllers,
};
