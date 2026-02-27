module.exports = {
    success: (data = {}) => ({
        status: "success",
        data,
    }),

    fail: (data = {}) => ({
        status: "fail",
        data,
    }),

    error: (message, code = 500, data = null) => {
        const response = {
        status: "error",
        message,
        code,
        };
        if (data) response.data = data;
        return response;
    },
};