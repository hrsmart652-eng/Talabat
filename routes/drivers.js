const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");
const DriverController = require("../controllers/DriverController");
const DriverValidator = require("../middlewares/validators/DriverValidator");

router.get("/me", AuthMiddleware, DriverController.getMyDriverProfile);

router.post(
  "/",
  AuthMiddleware,
  DriverValidator.createDriverProfile(),
  DriverController.createDriverProfile,
);

router.patch(
  "/me",
  AuthMiddleware,
  DriverValidator.updateDriverProfile(),
  DriverController.updateDriverProfile,
);

router.get(
  "/",
  AuthMiddleware,
  IsAdmin,
  DriverValidator.get(),
  DriverController.getDrivers,
);

router.patch(
  "/availability",
  AuthMiddleware,
  DriverValidator.setAvailability(),
  DriverController.setAvailability,
);

router.patch(
  "/location",
  AuthMiddleware,
  DriverValidator.updateLocation(),
  DriverController.updateLocation,
);

module.exports = router;
