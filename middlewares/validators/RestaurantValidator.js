const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");
const path = require("path");

class RestaurantValidator extends BaseValidator {

    static addRestaurant() {
        return this.withValidation([
            body("name")
                .notEmpty().withMessage("Restaurant name is required")
                .isString().withMessage("Name must be a string"),

            body("description")
                .optional()
                .isString().withMessage("Description must be a string"),

            body("logo").custom((value, { req }) => {
                if (req.files && req.files.logo) {
                    const file = req.files.logo[0];
                    const filetypes = /jpeg|jpg|png/;
                    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                    if (!extname) {
                        throw new Error("Logo must be an image (jpeg, jpg, or png)");
                    }
                }
                return true;
            }),

            body("cover_image").custom((value, { req }) => {
                if (req.files && req.files.cover_image) {
                    const file = req.files.cover_image[0];
                    const filetypes = /jpeg|jpg|png/;
                    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                    if (!extname) {
                        throw new Error("Cover image must be an image (jpeg, jpg, or png)");
                    }
                }
                return true;
            }),

            body("rating")
                .optional()
                .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

            body("delivery_time")
                .optional()
                .isInt({ min: 1 }).withMessage("Delivery time must be a positive integer"),

            body("is_open")
                .optional()
                .isBoolean().withMessage("is_open must be true or false"),
        ]);
    }

    static updateRestaurant() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid restaurant ID"),

            body("name")
                .optional()
                .isString().withMessage("Name must be a string"),

            body("description")
                .optional()
                .isString().withMessage("Description must be a string"),

            body("logo").custom((value, { req }) => {
                if (req.files && req.files.logo) {
                    const filetypes = /jpeg|jpg|png/;
                    const extname = filetypes.test(path.extname(req.files.logo[0].originalname).toLowerCase());
                    if (!extname) throw new Error("Logo must be an image");
                }
                return true;
            }),

            body("rating")
                .optional()
                .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

            body("delivery_time")
                .optional()
                .isInt({ min: 1 }).withMessage("Delivery time must be a positive integer"),

            body("is_open")
                .optional()
                .isBoolean().withMessage("is_open must be true or false"),
        ]);
    }

    static getRestaurant() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid restaurant ID"),
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

    static toggleOpenClose() {
        return this.withValidation([
            param("id")
                .isMongoId().withMessage("Invalid restaurant ID"),
        ]);
    }
}

module.exports = RestaurantValidator;