var express = require("express");
var AuthValidator = require("../middlewares/validators/AuthValidator");
var AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
var router = express.Router();

router.post('/register', AuthValidator.register(), AuthController.registerUser);
router.post('/verify-email', AuthValidator.verifyEmail(), AuthController.verifyEmail);
router.post('/forget-password', AuthValidator.forgetPassword(), AuthController.forgetPassword);
router.post('/reset-password', AuthValidator.resetPassword(), AuthController.resetPassword);
router.post('/login', AuthValidator.login(), AuthController.loginUser);
router.post('/logout', AuthMiddleware, AuthController.logoutUser);

module.exports = router;

