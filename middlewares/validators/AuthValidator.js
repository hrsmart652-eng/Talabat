const BaseValidator = require("./baseValidator");
const { body } = require("express-validator");
const User = require("../../models/User");

class AuthValidator extends BaseValidator {
  static register() {
    return this.withValidation([
      body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

      body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .custom(async (value) => {
          const existing = await User.findOne({ email: value });
          if (existing) throw new Error("Email already exists");
          return true;
        }),

      body("phone")
        .notEmpty().withMessage("Phone number is required"),

      body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    ]);
  }

  static login() {
    return this.withValidation([
      body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email"),

      body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    ]);
  }

  static forgetPassword() {
    return this.withValidation([
      body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email"),
    ]);
  }

  static resetPassword() {
    return this.withValidation([
      body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email"),
      body("code")
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
      body("newpassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("New password must be at least 8 characters long"),
    ]);
  }

  static verifyEmail() {
    return this.withValidation([
      body("code")
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
      body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email"),
    ]);
  }
}

module.exports = AuthValidator;