const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    otp: {
      type: Number,
    },
    otp_expire: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema.methods.GetJWT = async function () {
  const user = this;
  const token = await JWT.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET_kEY,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
