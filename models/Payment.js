const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    method: {
      type: String,
      enum: ["cash", "card", "wallet"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    transaction_id: {
      type: String,
      default: null,
    },

    paid_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", PaymentSchema);