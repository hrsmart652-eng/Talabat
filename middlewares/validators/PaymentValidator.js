const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");


class PaymentValidator extends BaseValidator {

  static makePayment() {
    return this.withValidation([
      body("order_id")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID"),
      body("method")
        .notEmpty()
        .withMessage("Payment method is required")
        .isIn(["cash", "card", "wallet"])
        .withMessage("Payment method must be cash, card, or wallet"),
    ]);
  }

  static getPayment() {
    return this.withValidation([
      param("id").isMongoId().withMessage("Invalid payment ID"),
    ]);
  }

  static getPayments() {
    return this.withValidation([
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
      query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
      query("status")
        .optional()
        .isIn(["pending", "paid", "failed"])
        .withMessage("Status must be pending, paid, or failed"),
      query("method")
        .optional()
        .isIn(["cash", "card", "wallet"])
        .withMessage("Method must be cash, card, or wallet"),
    ]);
  }

  static updateStatus() {
    return this.withValidation([
      param("id").isMongoId().withMessage("Invalid payment ID"),
      body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "paid", "failed"])
        .withMessage("Status must be pending, paid, or failed"),
    ]);
  }

  static deletePayment() {
    return this.withValidation([
      param("id").isMongoId().withMessage("Invalid payment ID"),
    ]);
  }
}


module.exports = PaymentValidator;
