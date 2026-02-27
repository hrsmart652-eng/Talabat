const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { logError } = require("../utils/Logger");

function errorHandler(err, req, res, next) {
    logError("Internal Server Error: ", err);

    if (err.status === Constants.STATUSCODE.NOT_FOUND
        || err.status === Constants.STATUSCODE.FORBIDDEN
        || err.status === Constants.STATUSCODE.BAD_REQUEST) {
        res.status(err.status).json(
            Jsend.fail(err.message)
        );
    }

    res.status(err.http_code || Constants.STATUSCODE.SERVER_ERROR).json(
        Jsend.error(err.message || "Internal Server Error"
            , err.http_code || Constants.STATUSCODE.SERVER_ERROR
            , err.details || null)
    );
}

module.exports = errorHandler;
