const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const RestaurantController = require("../controllers/RestaurantController");
const RestaurantValidator = require("../middlewares/validators/RestaurantValidator");


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
  RestaurantValidator.addRestaurant(),
  RestaurantController.addRestaurant
);

// Update Restaurant (Admin)
router.patch(
  "/:id",
  AuthMiddleware,
  IsAdmin,
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
