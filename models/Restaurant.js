const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    cover_image: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    delivery_time: {
      type: Number,
      default: 30,
    },

    is_open: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
