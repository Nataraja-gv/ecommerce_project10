const cartModel = require("../models/cartSchema");
const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");

const postCustomerCart = async (req, res) => {
  try {
    const userID = req.user._id;
    const { items } = req.body;

    if (!items || !items.product || !items.quantity) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required" });
    }

    const validProducts = await ProductModel.findOne({ _id: items?.product });

    if (!validProducts) {
      return res.status(400).json({ message: "Invalid product" });
    }

    let existingCart = await cartModel.findOne({ customer: userID });

    if (existingCart) {
      const existingItem = existingCart.items.find(
        (item) => item.product.toString() === items.product,
      );
      if (existingItem) {
        existingItem.quantity = items.quantity;
      } else {
        existingCart.items.push({
          product: items.product,
          quantity: items.quantity,
        });
      }
      await existingCart.save();
    } else {
      existingCart = new cartModel({
        customer: userID,
        items: [
          {
            product: items.product,
            quantity: items.quantity,
          },
        ],
      });
      await existingCart.save();
    }

    res.status(200).json({
      message: "Cart updated successfully",
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
    const { product } = req.body;

    const cartData = await cartModel.findOneAndUpdate(
      { customer: userId },
      { $pull: { items: { product: product } } },
      { new: true },
    );
    res?.status(200)?.json({
      message: "Items removed from cart successfully",
      _payload: cartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAllCartItems = async (req, res) => {
  try {
    const userID = req.user._id;
    const { items } = req.body;
    let existingCart = await cartModel.findOne({ customer: userID });

    const arrayItems = Array.isArray(items)
      ? items.map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
          };
        })
      : [];

    if (existingCart) {
      existingCart.items = [...existingCart.items, ...arrayItems];
      await existingCart.save();
    } else {
      const newCart = new cartModel({
        customer: userID,
        items: arrayItems,
      });
      await newCart.save();
    }
    res.status(200).json({
      message: "All cart items added successfully",
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
  addAllCartItems,
};
