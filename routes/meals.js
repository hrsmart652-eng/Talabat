const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const MealController = require("../controllers/MealController");
const MealValidator = require("../middlewares/validators/MealValidator");
const uploadMeal = require("../middlewares/uploadMeal");


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
  uploadMeal.single("image"),
  MealValidator.addMeal(),
  MealController.addMeal
);

// Update Meal (Admin)
router.patch(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  uploadMeal.single("image"),
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
