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
  },
  { timestamps: true },
);

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
