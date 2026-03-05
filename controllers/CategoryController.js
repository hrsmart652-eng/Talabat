const fs = require("fs");
const Category = require("../models/Category");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const browseCategories = async function (req, res, next) {
    try {
        const { page, limit, skip } = paginate(req);

        const categories = await Category
            .find()
            .skip(skip)
            .limit(limit);

        const countDocs = await Category.countDocuments();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                categories,
                pagination: {
                    total: countDocs,
                    page,
                    pages: Math.ceil(countDocs / limit),
                    limit
                }
            })
        );

    } catch (error) {
        next(error);
    }
};



const addCategory = async function (req, res, next) {
    try {
        const category = new Category({
            name: req.body.name,
            image: req.file ? req.file.path : "",
        });

        await category.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({
                message: "Category created",
                category
            })
        );

    } catch (error) {
        next(error);
    }
};



module.exports = {
    browseCategories,
    addCategory
};
