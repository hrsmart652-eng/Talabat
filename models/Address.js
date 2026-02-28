const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String
    },
    building: {
        type: String
    },
    floor: {
        type: String
    },
    notes: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Address", addressSchema);