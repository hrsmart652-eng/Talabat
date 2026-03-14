const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");

class ReviewValidator extends BaseValidator {

    static addReview() {
        return this.withValidation([
            body("meal_id")
                .notEmpty().withMessage("Meal ID is required")
                .isMongoId().withMessage("Invalid meal ID"),

            body("rating")
                .notEmpty().withMessage("Rating is required")
                .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

            body("comment")
                .optional()
                .isString().withMessage("Comment must be a string"),
        ]);
    }

    static deleteReview() {
        return this.withValidation([
            param("id").isMongoId().withMessage("Invalid review ID"),
        ]);
    }

    static getReviews() {
        return this.withValidation([
            query("meal_id")
                .optional()
                .isMongoId().withMessage("Invalid meal ID"),

            query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
            query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
        ]);
    }
}

module.exports = ReviewValidator;
