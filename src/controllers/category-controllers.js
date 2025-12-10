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

module.exports = { addCategoryControllers };
