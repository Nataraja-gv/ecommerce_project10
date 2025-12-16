const JWT = require("jsonwebtoken");
const UserModel = require("../models/user-model");

const userAuth = async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    return res.status(401).json({ message: "please login" });
  }
  const deCoded = JWT.verify(auth_token, process.env.JWT_SECRET_kEY);
  const { _id } = deCoded;
  const user = await UserModel.findById({ _id });
  req.user = user;
  next();
};

module.exports = userAuth;
