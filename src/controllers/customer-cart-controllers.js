const cartModel = require("../models/cartSchema");
const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");

const postCustomerCart = async (req, res) => {
  try {
    const userID = req.user._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // for (const item of items) {
    //   if (!mongoose.Types.onjectId.isValid(item.product)) {
    //     return res.status(400).json({ message: "Invalid product ID" });
    //   }
    // }

    const productsIds = items?.map((item) => item.product);
    const uniqueProductIds = [...new Set(productsIds)];

    const validProducts = await ProductModel.find({
      _id: { $in: uniqueProductIds },
    });

    if (validProducts?.length !== uniqueProductIds?.length) {
      return res
        .status(400)
        .json({ message: "One or more products are invalid" });
    }

    let existingCart = await cartModel.findOne({ customer: userID });

    if (existingCart) {
      items.forEach((newitem) => {
        const existCartProducts = existingCart.items.find(
          (olditem) => olditem.product.toString() === newitem.product
        );
        if (existCartProducts) {
          existCartProducts.quantity += newitem.quantity;
        } else {
          existingCart.items.push({
            product: newitem.product,
            quantity: newitem.quantity,
          });
        }
      });
      await existingCart.save();
    } else {
      existingCart = new cartModel({
        customer: userID,
        items: items?.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      });
      await existingCart.save();
    }

    res?.status(200)?.json({
      message: "Customer cart posted successfully",
      //   _payload: cartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerCart = async (req, res) => {
  try {
    const userID = req.user._id;
    const cartData = await cartModel
      .findOne({ customer: userID })
      .select("items")
      .populate("items.product");
    res?.status(200)?.json({
      message: "Customer cart fetched successfully",
      _payload: cartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCustomerCart = async (req, res) => {
  try {
    const userID = req.user._id;
    const cartData = await cartModel.findOneAndDelete({ customer: userID });
    res?.status(200)?.json({
      message: "Customer cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productIds } = req.body;
    const uniqueProductIds = [...new Set(productIds)];

    const cartData = await cartModel.findOneAndUpdate(
      { customer: userId },
      { $pull: { items: { product: uniqueProductIds } } },
      { new: true }
    );
    res?.status(200)?.json({
      message: "Items removed from cart successfully",
      _payload: cartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  postCustomerCart,
  getCustomerCart,
  clearCustomerCart,
  removeFromCartItem,
};
