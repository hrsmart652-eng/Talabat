const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
});

blacklistedTokenSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

const BlackListedToken = mongoose.model('BlackListedToken', blacklistedTokenSchema);
module.exports = BlackListedToken;