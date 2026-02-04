const express = require("express");
const userAuth = require("../middleware/user-auth");
const {
  razorpayCreateOrder,
  razorpayVerifyPayment,
} = require("../controllers/payment-controllers");

const razorpayRouter = express.Router();

razorpayRouter.post(
  "/auth/razorpay-create-order",
  userAuth,
  razorpayCreateOrder,
);

razorpayRouter.post("/api/orders/payment/verify/webhook", razorpayVerifyPayment);

module.exports = razorpayRouter;
