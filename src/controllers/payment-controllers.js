const addressModel = require("../models/addressSchema");
const cartModel = require("../models/cartSchema");
const OrderModel = require("../models/orderSchema");
const ProductModel = require("../models/product-model");
const UserModel = require("../models/user-model");
const razorpayInstance = require("../utils/razorpayInstance");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const razorpayCreateOrder = async (req, res) => {
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

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 1000}`,
      notes: {
        user_name: user.name,
        user_email: userEmail,
      },
    };
    const razorpayResponse = await razorpayInstance.orders.create(options);
    const newOrder = new OrderModel({
      customer_details: userId,
      address_details: address_details,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      payment_method: payment_method.toUpperCase(),
      totalAmount: razorpayResponse.amount / 100,
      razorpayDetails: {
        orderId: razorpayResponse.id,
      },
      notes: razorpayResponse.notes,
    });
    await newOrder.save();
    await cartModel.findOneAndDelete({ customer: userId });
    res.status(200).json({ message: "payment data", data: razorpayResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const razorpayVerifyPayment = async (req, res) => {
  try {
    console.log("webhook1");
    const webhookSignature = req.get("X-Razorpay-Signature");
    const validWebhookSignature = validateWebhookSignature(
      req.body,
      webhookSignature,
      process.env.Razorpay_webhookSecret,
    );
    if (!validWebhookSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }
    const paymentDetails = req.body.payload.payment.entity;
    
    console.log(paymentDetails, " paymentDetails");

    const order = await OrderModel.findOne({
      "razorpayDetails.orderId": paymentDetails?.order_id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.paymentStatus =
      paymentDetails?.status === "captured" ? "Paid" : "Failed";
    order.razorpayDetails.paymentId = paymentDetails.id;
    order.razorpayDetails.signature = webhookSignature;
    console.log(order, "order");
    await order.save();
    res.status(200).json({ message: "webhook received successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { razorpayCreateOrder, razorpayVerifyPayment };
