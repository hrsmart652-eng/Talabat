const BaseValidator = require("./baseValidator");
const { body, param } = require("express-validator");

class AddressValidator extends BaseValidator {
  static create() {
    return this.withValidation([
      body("city")
        .notEmpty().withMessage("City is required")
        .isString(),
      body("street")
        .notEmpty().withMessage("Street is required")
        .isString(),
      body("building")
        .notEmpty().withMessage("Building is required")
        .isString(),
      body("floor")
        .notEmpty().withMessage("Floor is required")
        .isString(),
      body("notes")
        .optional()
        .isString(),
      body("lat")
        .optional()
        .isFloat(),
      body("lng")
        .optional()
        .isFloat()
    ]);
  }

  static update() {
    return this.withValidation([
      param("id")
        .notEmpty().withMessage("Address ID is required"),
      body("city")
        .optional()
        .isString(),
      body("street")
        .optional()
        .isString(),
      body("building")
        .optional()
        .isString(),
      body("floor")
        .optional()
        .isString(),
      body("notes")
        .optional()
        .isString(),
      body("lat")
        .optional()
        .isFloat(),
      body("lng")
        .optional()
        .isFloat()
    ]);
  }

  static delete() {
    return this.withValidation([
      param("id")
        .notEmpty().withMessage("Address ID is required")
    ]);
  }
}

module.exports = AddressValidator;