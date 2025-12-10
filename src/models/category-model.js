const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    category_image: {
      image_link: { type: String, required: true },
      image_key: { type: String, required: true },
    },
    category_description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
