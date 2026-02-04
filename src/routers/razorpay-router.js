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

razorpayRouter.post(
  "/api/orders/payment/verify/webhook",
  async (req, res, next) => {
    console.log(
      "/api/orders/payment/verify/webhook",
      "/api/orders/payment/verify/webhook",
    );
    next();
  },
  razorpayVerifyPayment,
);

module.exports = razorpayRouter;
