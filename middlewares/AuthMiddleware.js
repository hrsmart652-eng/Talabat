const jwt = require("jsonwebtoken");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const User = require("../models/User");
const BlackListedToken = require("../models/BlackListedToken");

async function AuthMiddleware(req, res, next) {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
                Jsend.fail({
                    message: "No Token Provided"
                })
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.id
        });
        const blackListedToken = await BlackListedToken.findOne({ token });

        if (!user || blackListedToken) {
            return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
                Jsend.fail({
                    message: "Invalid Token"
                })
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = AuthMiddleware;