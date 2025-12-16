const express = require("express");
const {
  addCategoryControllers,
  updateCategoryControllers,
  deleteCategoryControllers,
  getAllCategoriesControllers,
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

categoryRouter.put(
  "/category/update/:category_id",
  userAuth,
  upload.single("category_image"),
  updateCategoryControllers
);

categoryRouter.delete(
  "/category/delete/:category_id",
  userAuth,
  deleteCategoryControllers
);

categoryRouter.get("/category/all", getAllCategoriesControllers);

module.exports = categoryRouter;
