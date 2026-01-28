const express = require("express");
const {
  postAddress,
  putAddress,
  deleteAdress,
  getAllCustmerAddresses,
  selectedAddress,
} = require("../controllers/address-controllers");
const userAuth = require("../middleware/user-auth");

const addressRouter = express.Router();

addressRouter.post("/auth/address/add", userAuth, postAddress);
addressRouter.put("/auth/address/update/:addressId", userAuth, putAddress);
addressRouter.delete("/auth/address/delete/:addressId", userAuth, deleteAdress);
addressRouter.get("/auth/address/all", userAuth, getAllCustmerAddresses);
addressRouter.get("/auth/address/all", userAuth, getAllCustmerAddresses);
addressRouter.put("/auth/address/select/:addressId", userAuth, selectedAddress);

module.exports = addressRouter;
