const express = require("express");
const {
  authSignup,
  verfilyOTP,
  resendOtp,
} = require("../controllers/auth-controllers");

const authRouter = express.Router();

authRouter.post("/auth/login", authSignup);
authRouter.post("/auth/verify_otp", verfilyOTP);
authRouter.post("/auth/resend", resendOtp);

module.exports = authRouter;
