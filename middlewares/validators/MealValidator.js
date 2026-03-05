const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");
const path = require("path");

class MealValidator extends BaseValidator {

    static addMeal() {
        return this.withValidation([
            body("restaurant_id")
                .notEmpty().withMessage("Restaurant ID is required")
                .isMongoId().withMessage("Invalid restaurant ID"),

            body("category_id")
                .notEmpty().withMessage("Category ID is required")
                .isMongoId().withMessage("Invalid category ID"),

            body("name")
                .notEmpty().withMessage("Meal name is required")
                .isString().withMessage("Name must be a string"),

            body("description")
                .optional()
                .isString().withMessage("Description must be a string"),

            body("price")
                .notEmpty().withMessage("Price is required")
                .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

            body("image").custom((value, { req }) => {
                if (req.file) {
                    const filetypes = /jpeg|jpg|png/;
                    const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
                    if (!extname) {
                        throw new Error("Image must be an image (jpeg, jpg, or png)");
                    }
                }
                return true;
            }),

            body("rating")
                .optional()
                .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

            body("is_available")
                .optional()
                .isBoolean().withMessage("is_available must be true or false"),
        ]);
    }

    static updateMeal() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid meal ID"),

            body("restaurant_id")
                .optional()
                .isMongoId().withMessage("Invalid restaurant ID"),

            body("category_id")
                .optional()
                .isMongoId().withMessage("Invalid category ID"),

            body("name")
                .optional()
                .isString().withMessage("Name must be a string"),

            body("description")
                .optional()
                .isString().withMessage("Description must be a string"),

            body("price")
                .optional()
                .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

            body("image").custom((value, { req }) => {
                if (req.file) {
                    const filetypes = /jpeg|jpg|png/;
                    const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
                    if (!extname) {
                        throw new Error("Image must be an image (jpeg, jpg, or png)");
                    }
                }
                return true;
            }),

            body("rating")
                .optional()
                .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

            body("is_available")
                .optional()
                .isBoolean().withMessage("is_available must be true or false"),
        ]);
    }

    static getMeal() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid meal ID"),
        ]);
    }

    static get() {
        return this.withValidation([
            query("page")
                .optional()
                .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

            query("limit")
                .optional()
                .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
        ]);
    }

    static deleteMeal() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid meal ID"),
        ]);
    }

    static toggleAvailability() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid meal ID"),
        ]);
    }
}

module.exports = MealValidator;
