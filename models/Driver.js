const mongoose = require("mongoose");

const driverProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    vehicle_type: String,

    vehicle_number: String,

    is_available: {
      type: Boolean,
      default: true,
    },

    current_lat: Number,
    current_lng: Number,

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

module.exports = mongoose.model("DriverProfile", driverProfileSchema);