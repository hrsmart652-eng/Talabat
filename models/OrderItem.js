const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  meal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);