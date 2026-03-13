const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");

class OrderValidator extends BaseValidator {

    static placeOrder() {
        return this.withValidation([
            body("address_id")
                .notEmpty().withMessage("Address ID is required")
                .isMongoId().withMessage("Invalid address ID"),

            body("payment_method")
                .notEmpty().withMessage("Payment method is required")
                .isIn(["cash", "card"]).withMessage("Payment method must be 'cash' or 'card'"),

            body("items")
                .isArray({ min: 1 }).withMessage("Items must be an array with at least one item"),

            body("items.*.meal_id")
                .notEmpty().withMessage("Meal ID is required")
                .isMongoId().withMessage("Invalid Meal ID"),

            body("items.*.quantity")
                .notEmpty().withMessage("Quantity is required")
                .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

            body("items.*.price")
                .optional()
                .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
        ]);
    }

    static trackOrder() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid Order ID"),
        ]);
    }

    static getOrders() {
        return this.withValidation([
            query("page")
                .optional()
                .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

            query("limit")
                .optional()
                .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
        ]);
    }

    static assignDriver() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid Order ID"),

            body("driver_id")
                .notEmpty().withMessage("Driver ID is required")
                .isMongoId().withMessage("Invalid Driver ID"),
        ]);
    }

    static deleteOrder() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid Order ID"),
        ]);
    }

    static updateStatus() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid Order ID"),

            body("status")
                .notEmpty().withMessage("Status is required")
                .isIn(["pending", "preparing", "on_the_way", "delivered", "cancelled"])
                .withMessage("Invalid status value"),
        ]);
    }

}

module.exports = OrderValidator;