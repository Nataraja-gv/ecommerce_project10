const validator = require("validator");
const transporter = require("../utils/send-email");
const UserModel = require("../models/user-model");

const authSignup = async (req, res) => {
  try {
    const { user_name, email } = req.body;

    if (!user_name || !email) {
      throw new Error("User Name and Email is required");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Format");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpire = Date.now() + 2 * 60 * 1000;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // Update OTP for old user
      existingUser.otp = otp;
      existingUser.otp_expire = otpExpire;
      existingUser.user_name = user_name || existingUser.user_name; // optional

      await existingUser.save();

      // Send email
      await transporter.sendMail({
        from: "Ecommerce <nataraja2k00@gmail.com>",
        to: email,
        subject: "Your OTP Verification Code",
        html: `
          <h2>Hello ${existingUser.user_name} 👋</h2>
          <p>Your OTP for email verification is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 2 minutes.</p>
        `,
      });

      return res.status(200).json({
        message: "OTP Sent Successfully ",
      });
    }

    // Create new user
    const user = new UserModel({
      user_name,
      email,
      otp,
      otp_expire: otpExpire,
    });

    const saveUser = await user.save();

    // Send OTP Email
    await transporter.sendMail({
      from: "Ecommerce <nataraja2k00@gmail.com>",
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Hello ${saveUser.user_name} 👋</h2>
        <p>Your OTP for email verification is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 2 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verfilyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new Error("inValid User");
    }

    if (Date.now() > existingUser.otp_expire) {
      throw new Error("OTP Expired. Please request a new one.");
    }
    if (Number(otp) !== Number(existingUser.otp)) {
      throw new Error("Invalid OTP");
    }

    existingUser.otp = null;
    existingUser.otp_expire = null;

    const saveUser = await existingUser.save();

    const auth_token = await saveUser.GetJWT();
    res.cookie("auth_token", auth_token);
    res.status(200).json({
      message: "OTP Verified Successfully",
      data: existingUser,
    });
  } catch (error) {
    res.status(404).json({ message: error?.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Format");
    }
    let existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new Error("inValid User");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpire = Date.now() + 2 * 60 * 1000;

    const mailOption = {
      from: "Ecommerce <nataraja2k00@gmail.com>",
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Hello ${existingUser.user_name} 👋</h2>
        <p>Your OTP for email verification is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 2 minutes.</p>
      `,
    };

    (existingUser.otp = otp), (existingUser.otp_expire = otpExpire);
    await existingUser.save();

    await transporter.sendMail(mailOption);
    res.status(200).json({
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    res.status(404).json({ message: error?.message });
  }
};

const authLogout = async (req, res) => {
  try {
    res.clearCookie("auth_token", null, { expires: Date.now() });
    res.status(200).json({
      message: "Logged Out Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authSignup, verfilyOTP, resendOtp, authLogout };
