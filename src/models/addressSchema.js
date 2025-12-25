const mongoose = require("mongoose");

const customerAddressSchema = new mongoose.Schema(
  {
    delivery_customer_name: {
      type: String,
      required: true,
    },
    delivery_phone_number: {
      type: String,
      required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

const addressSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    addresses: [customerAddressSchema],
  },
  {
    timestamps: true,
  }
);

const addressModel = mongoose.model("Address", addressSchema);
module.exports = addressModel;
