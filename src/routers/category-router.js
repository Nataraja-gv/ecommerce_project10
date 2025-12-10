const express = require("express");
const {
  addCategoryControllers,
} = require("../controllers/category-controllers");
const userAuth = require("../middleware/user-auth");
const upload = require("../middleware/multer");

const categoryRouter = express.Router();

categoryRouter.post(
  "/category/add",
  userAuth,
  upload.single("category_image"),
  addCategoryControllers
);

module.exports = categoryRouter;
