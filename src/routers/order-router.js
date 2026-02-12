const express = require("express");
const { placeTheOrder, AllOrderList } = require("../controllers/order-controllers");
const userAuth = require("../middleware/user-auth");

const orderRouter = express.Router();

orderRouter.post("/auth/create-order", userAuth, placeTheOrder);
orderRouter.get("/auth/All/order-list",userAuth,AllOrderList)

module.exports = orderRouter;
