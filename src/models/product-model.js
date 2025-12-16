const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    product_images: [
      {
        image_link: { type: String, required: true },
        image_key: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    mrp: {
      type: Number,
      required: true,
    },

    discount_percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true, // visible or hidden
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
