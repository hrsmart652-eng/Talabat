const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const RestaurantController = require("../controllers/RestaurantController");
const RestaurantValidator = require("../middlewares/validators/RestaurantValidator");
const uploadRestaurant = require("../middlewares/upload");


router.get(
  "/",
  AuthMiddleware,
  RestaurantValidator.get(),
  RestaurantController.browseRestaurants
);

router.get(
  "/:id",
  AuthMiddleware,
  RestaurantValidator.getRestaurant(),
  RestaurantController.getRestaurant
);

// Add Restaurant (Admin)
router.post(
  "/",
  AuthMiddleware,
  IsAdmin,
  uploadRestaurant.fields([{ name: "logo", maxCount: 1 }, { name: "cover_image", maxCount: 1 }]),
  RestaurantValidator.addRestaurant(),
  RestaurantController.addRestaurant
);

// Update Restaurant (Admin)
router.patch(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  uploadRestaurant.fields([{ name: "logo", maxCount: 1 }, { name: "cover_image", maxCount: 1 }]),
  RestaurantValidator.updateRestaurant(),
  RestaurantController.updateRestaurant
);

// Open/Close Restaurant (Admin)
router.patch(
  "/:id/toggle",
  AuthMiddleware,
  IsAdmin,
  RestaurantValidator.toggleOpenClose(),
  RestaurantController.toggleOpenClose
);

module.exports = router;
