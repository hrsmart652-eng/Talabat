const BaseValidator = require("./baseValidator");
const { body, param, query } = require("express-validator");
const User = require("../../models/User");

class UserValidator extends BaseValidator {

    static updateProfile() {
        return this.withValidation([

            body("password")
                .notEmpty().withMessage("Password is required"),

            body("name")
                .optional()
                .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

            body("email")
                .optional()
                .isEmail().withMessage("Must be a valid email")
                .custom(async (value, { req }) => {
                    const existing = await User.findOne({ email: value });

                    if (existing && existing._id.toString() !== req.user._id.toString()) {
                        throw new Error("Email already exists");
                    }

                    return true;
                }),

            body("phone")
                .optional()
                .isString().withMessage("Phone must be a string"),
        ]);
    }

    static updatePassword() {
        return this.withValidation([

            body("oldPassword")
                .notEmpty().withMessage("Old password is required"),

            body("newPassword")
                .notEmpty().withMessage("New password is required")
                .isLength({ min: 8 })
                .withMessage("Password must be at least 8 characters"),
        ]);
    }

    static updateUserRole() {
        return this.withValidation([

            param("id")
                .isMongoId()
                .withMessage("Invalid user id"),

            body("role")
                .notEmpty()
                .withMessage("Role is required")
                .isIn(["customer", "driver", "admin"])
                .withMessage("Role must be customer, driver, or admin"),
        ]);
    }

    static getUsers() {
        return this.withValidation([

            query("page")
                .optional()
                .isInt({ min: 1 })
                .withMessage("Page must be a positive number"),

            query("limit")
                .optional()
                .isInt({ min: 1 })
                .withMessage("Limit must be a positive number"),
        ]);
    }

    static updateAvatar() {
        return this.withValidation([
            body("avatar")
                .custom((value, { req }) => {
                    if (!req.file) {
                        throw new Error("Avatar image is required");
                    }
                    return true;
                })
        ]);
    }

}

module.exports = UserValidator;