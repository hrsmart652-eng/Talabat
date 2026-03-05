const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");
const path = require("path");

class CategoryValidator extends BaseValidator {

    static addCategory() {
        return this.withValidation([
            body("name")
                .notEmpty().withMessage("Category name is required")
                .isString().withMessage("Name must be a string"),

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
}

module.exports = CategoryValidator;
