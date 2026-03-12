const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const IsAdmin = require("../middlewares/IsAdmin");

const OrderController = require("../controllers/OrderController");
const OrderValidator = require("../middlewares/validators/OrderValidator");


// Create Order (User)
router.post(
  "/",
  AuthMiddleware,
  OrderValidator.placeOrder(),
  OrderController.placeOrder
);


// Get Order By ID (User/Admin)
router.get(
  "/:id",
  AuthMiddleware,
  OrderValidator.trackOrder(),
  OrderController.trackOrder
);


// Get All Orders (Admin)
router.get(
  "/",
  AuthMiddleware,
  IsAdmin,
  OrderValidator.getOrders(),
  OrderController.getOrders
);


// Assign Driver (Admin)
router.patch(
  "/:id/assign-driver",
  AuthMiddleware,
  IsAdmin,
  OrderValidator.assignDriver(),
  OrderController.assignDriver
);


// Update Order Status
router.patch(
  "/:id/status",
  AuthMiddleware,
  OrderValidator.updateStatus(),
  OrderController.updateStatus
);


// Delete Order (Admin)
router.delete(
  "/:id",
  AuthMiddleware,
  IsAdmin,
  OrderValidator.deleteOrder(),
  OrderController.deleteOrder
);

module.exports = router;