const express = require("express");
const userAuth = require("../middleware/user-auth");
const {
  postCustomerCart,
  getCustomerCart,
  clearCustomerCart,
  removeFromCartItem,
} = require("../controllers/customer-cart-controllers");

const cartRouter = express.Router();

cartRouter.post("/auth/customer/cart", userAuth, postCustomerCart);
cartRouter.get("/auth/customer/cart/items", userAuth, getCustomerCart);
cartRouter.delete("/auth/customer/cart/items", userAuth, clearCustomerCart);
cartRouter.put("/auth/customer/cart/item/remove", userAuth, removeFromCartItem);

module.exports = cartRouter;
