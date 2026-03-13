const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const CategoryController = require("../controllers/CategoryController");
const CategoryValidator = require("../middlewares/validators/CategoryValidator");
const upload = require("../middlewares/upload");

router.get(
  "/",
  AuthMiddleware,
  CategoryValidator.get(),
  CategoryController.browseCategories,
);

router.post(
  "/",
  AuthMiddleware,
  IsAdmin,
  upload.single("category_image"),
  CategoryValidator.addCategory(),
  CategoryController.addCategory,
);

router.get(
  "/:id", 
  AuthMiddleware,
  CategoryValidator.getCategory(), 
  CategoryController.getCategory
);

router.put(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  upload.single("category_image"),
  CategoryValidator.updateCategory(),
  CategoryController.updateCategory,
);

router.delete(
  "/:id", 
  AuthMiddleware,
  IsAdmin,
  CategoryValidator.deleteCategory(), 
  CategoryController.deleteCategory
);

module.exports = router;
