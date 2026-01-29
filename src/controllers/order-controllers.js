const addressModel = require("../models/addressSchema");
const cartModel = require("../models/cartSchema");
const OrderModel = require("../models/orderSchema");
const Order = require("../models/orderSchema");
const ProductModel = require("../models/product-model");
const UserModel = require("../models/user-model");

const placeTheOrder = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const userEmail = user.email;
    const { address_details, payment_method, items } = req.body;
    const validateUser = await UserModel.findById(userId);
    if (!validateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressDoc = await addressModel.find({ customerID: userId });
    const allAddresses = addressDoc.flatMap((doc) => doc.addresses);

    const validAddress = allAddresses.some(
      (address) => address._id.toString() === address_details,
    );

    if (!validAddress) {
      return res.status(400).json({ message: "Invalid address details" });
    }

    if (
      payment_method.toUpperCase() !== "COD" &&
      payment_method.toUpperCase() !== "ONLINE"
    ) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    if (!Array.isArray(items) || items?.length === 0) {
      return res.status(400).json({ message: "Items list cannot be empty" });
    }
    const quantityMap = {};
    for (let item of items) {
      const product = item.product;
      const quantity = Number(item.quantity);
      const isValidProduct = await ProductModel.findById(product);
      if (!isValidProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product} not found` });
      }

      if (quantityMap[product]) {
        quantityMap[product] += quantity;
      } else {
        quantityMap[product] = quantity;
      }
    }
    let totalAmount = 0;

    for (let product in quantityMap) {
      const productDetails = await ProductModel.findById(product);
      totalAmount += productDetails.product_price * quantityMap[product];
    }

    const newOrder = new OrderModel({
      customer_details: userId,
      address_details: address_details,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      payment_method: payment_method.toUpperCase(),
      totalAmount,
    });
    const orderResponse = await newOrder.save();
    if (!orderResponse) {
      return res.status(500).json({ message: "Failed to place order" });
    }

    await cartModel.findOneAndDelete({ customer: userId });

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeTheOrder };
