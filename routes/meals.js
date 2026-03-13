const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const MealController = require("../controllers/MealController");
const MealValidator = require("../middlewares/validators/MealValidator");
const upload = require("../middlewares/upload");


router.get(
  "/",
  AuthMiddleware,
  MealValidator.get(),
  MealController.browseMeals
);

router.get(
  "/:id",
  AuthMiddleware,
  MealValidator.getMeal(),
  MealController.getMeal
);

// Add Meal (Admin)
router.post(
  "/",
  AuthMiddleware,
  IsAdmin,
  upload.single("meal_image"),
  MealValidator.addMeal(),
  MealController.addMeal
);

// Update Meal (Admin)
router.patch(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  upload.single("meal_image"),
  MealValidator.updateMeal(),
  MealController.updateMeal
);

// Delete Meal (Admin)
router.delete(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  MealValidator.deleteMeal(),
  MealController.deleteMeal
);

// Toggle Meal Availability (Admin)
router.patch(
  "/:id/toggle",
  AuthMiddleware,
  IsAdmin,
  MealValidator.toggleAvailability(),
  MealController.toggleAvailability
);


module.exports = router;
