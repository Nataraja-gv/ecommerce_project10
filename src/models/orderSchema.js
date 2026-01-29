const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    address_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    items: [itemsSchema],
    payment_method: {
      type: String,
      required: true,
      enum: ["COD", "ONLINE"],
    },
    totalAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Out for Delivery",
        "Returned",
      ],
      default: "Placed",
    },
    razorpayDetails: {
      orderId: { type: String }, // razorpay_order_id
      paymentId: { type: String }, // razorpay_payment_id
      signature: { type: String }, // razorpay_signature
    },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model("Orders", orderSchema);
module.exports = OrderModel;