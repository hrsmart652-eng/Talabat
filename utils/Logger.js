function logError(message, err) {
    console.error(`[${new Date().toISOString()}] ${message}`,err);
}

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

module.exports = {
    logError,
    log
};