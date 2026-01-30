const express = require("express");
const userAuth = require("../middleware/user-auth");
const {
  addProducts,
  editProducts,
  getAllProducts,
  deleteProduct,
  getProductById,
  getProductByCategory,
} = require("../controllers/product-controllers");
const upload = require("../middleware/multer");

const productRouter = express.Router();

productRouter.post(
  "/product/add",
  userAuth,
  upload.array("product_images", 5),
  addProducts,
);

productRouter.put(
  "/product/edit/:_id",
  userAuth,
  upload.array("product_images", 5),
  editProducts,
);

productRouter.get("/product/all", getAllProducts);
productRouter.delete("/product/delete/:_id", deleteProduct);
productRouter.get(`/product/:productId`, getProductById);
productRouter.get(`/products/category/:categoryId`, getProductByCategory);

module.exports = productRouter;
