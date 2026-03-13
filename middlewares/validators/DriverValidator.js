const BaseValidator = require("./baseValidator");
const { body, query } = require("express-validator");

class DriverValidator extends BaseValidator {
  static createDriverProfile() {
    return this.withValidation([
      body("vehicle_type").notEmpty().withMessage("Vehicle type is required"),

      body("vehicle_number")
        .notEmpty()
        .withMessage("Vehicle number is required"),

      body("current_lat")
        .notEmpty()
        .withMessage("Current latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number"),

      body("current_lng")
        .notEmpty()
        .withMessage("Current longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number"),
    ]);
  }

  static updateDriverProfile() {
    return this.withValidation([
      body("vehicle_type")
        .optional()
        .isString()
        .withMessage("Vehicle type must be a string"),

      body("vehicle_number")
        .optional()
        .isString()
        .withMessage("Vehicle number must be a string"),

      body("current_lat")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number"),

      body("current_lng")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number"),

      body("is_available")
        .optional()
        .isBoolean()
        .withMessage("is_available must be true or false"),
    ]);
  }

  static setAvailability() {
    return this.withValidation([
      body("is_available")
        .notEmpty()
        .withMessage("Availability is required")
        .isBoolean()
        .withMessage("is_available must be true or false"),
    ]);
  }

  static updateLocation() {
    return this.withValidation([
      body("current_lat").notEmpty().isFloat({ min: -90, max: 90 }),

      body("current_lng").notEmpty().isFloat({ min: -180, max: 180 }),
    ]);
  }
}

module.exports = DriverValidator;
