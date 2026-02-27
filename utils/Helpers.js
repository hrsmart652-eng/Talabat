module.exports = {
    formatValidationErrors: (errors) => {
        return errors.array().reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
        },{});
    },

    paginate : (req) => {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;

        return {page, limit, skip};
    }
}