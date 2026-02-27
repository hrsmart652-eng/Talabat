const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    unVerifiedAt: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

module.exports = mongoose.model("User", userSchema);