const express = require("express");
const { placeTheOrder } = require("../controllers/order-controllers");
const userAuth = require("../middleware/user-auth");

const orderRouter = express.Router();

orderRouter.post("/auth/create-order", userAuth, placeTheOrder);

module.exports = orderRouter;
