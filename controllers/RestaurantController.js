const fs = require("fs");
const Restaurant = require("../models/Restaurant");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const browseRestaurants = async function (req, res, next) {
    try {
        const { page, limit, skip } = paginate(req);

        const restaurants = await Restaurant
            .find()
            .skip(skip)
            .limit(limit);

        const countDocs = await Restaurant.countDocuments();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                restaurants,
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



const getRestaurant = async function (req, res, next) {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Restaurant not found" })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ restaurant })
        );

    } catch (error) {
        next(error);
    }
};



const addRestaurant = async function (req, res, next) {
    try {
        const restaurant = new Restaurant({
            name: req.body.name,
            description: req.body.description,
            logo: req.files && req.files["logo"] ? req.files["logo"][0].path : "",
            cover_image: req.files && req.files["cover_image"] ? req.files["cover_image"][0].path : "",
            rating: req.body.rating,
            delivery_time: req.body.delivery_time,
            is_open: req.body.is_open,
        });

        await restaurant.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({
                message: "Restaurant created",
                restaurant
            })
        );

    } catch (error) {
        next(error);
    }
};



const updateRestaurant = async function (req, res, next) {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Restaurant not found" })
            );
        }

        const allowedFields = [
            "name",
            "description",
            "rating",
            "delivery_time",
            "is_open"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                restaurant[field] = req.body[field];
            }
        });

        // Handle logo upload
        if (req.files && req.files["logo"]) {
            if (restaurant.logo) {
                fs.unlink(restaurant.logo, (err) => {
                    if (err) console.error("Failed to delete old logo:", err.message);
                });
            }
            restaurant.logo = req.files["logo"][0].path;
        }

        // Handle cover_image upload
        if (req.files && req.files["cover_image"]) {
            if (restaurant.cover_image) {
                fs.unlink(restaurant.cover_image, (err) => {
                    if (err) console.error("Failed to delete old cover_image:", err.message);
                });
            }
            restaurant.cover_image = req.files["cover_image"][0].path;
        }

        await restaurant.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Restaurant updated",
                restaurant
            })
        );

    } catch (error) {
        next(error);
    }
};



const toggleOpenClose = async function (req, res, next) {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Restaurant not found" })
            );
        }

        restaurant.is_open = !restaurant.is_open;
        await restaurant.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: `Restaurant ${restaurant.is_open ? "opened" : "closed"}`,
                restaurant
            })
        );

    } catch (error) {
        next(error);
    }
};



module.exports = {
    browseRestaurants,
    getRestaurant,
    addRestaurant,
    updateRestaurant,
    toggleOpenClose
};
