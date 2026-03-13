const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");

const PaymentController = require("../controllers/PaymentController");
const PaymentValidator = require("../middlewares/validators/PaymentValidator");


router.post(
  "/",
  AuthMiddleware,
  PaymentValidator.makePayment(),
  PaymentController.makePayment
);

router.get(
  "/:id",
  AuthMiddleware,
  PaymentValidator.getPayment(),
  PaymentController.getPayment
);

router.get(
  "/",
  AuthMiddleware,
  IsAdmin,
  PaymentController.getPayments
);

router.patch(
  "/:id/status",
  AuthMiddleware,
  IsAdmin,
  PaymentValidator.updateStatus(),
  PaymentController.updatePaymentStatus
);

router.delete(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  PaymentValidator.deletePayment(),
  PaymentController.deletePayment
);

module.exports = router;