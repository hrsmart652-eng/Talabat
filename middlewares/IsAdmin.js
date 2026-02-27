const Constants = require("../utils/Constants");
const Jsend = require("../utils/Jsend");


function isAdmin(req, res, next) {
    try {
        if(req.user.role !== "admin") {
            return res.status(Constants.STATUSCODE.FORBIDDEN).json(
                Jsend.fail({
                    message: "Access denied"
                })
            );
        }
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = isAdmin;