const fs = require("fs");
const Meal = require("../models/Meal");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");


const browseMeals = async function (req, res, next) {
    try {
        const { page, limit, skip } = paginate(req);

        const meals = await Meal
            .find()
            .populate("restaurant_id", "name")
            .populate("category_id", "name")
            .skip(skip)
            .limit(limit);

        const countDocs = await Meal.countDocuments();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                meals,
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



const getMeal = async function (req, res, next) {
    try {
        const meal = await Meal.findById(req.params.id)
            .populate("restaurant_id", "name")
            .populate("category_id", "name");

        if (!meal) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Meal not found" })
            );
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ meal })
        );

    } catch (error) {
        next(error);
    }
};



const addMeal = async function (req, res, next) {
    try {
        const restaurant = await Restaurant.findById(req.body.restaurant_id);
        if (!restaurant) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Restaurant not found" })
            );
        }

        const category = await Category.findById(req.body.category_id);
        if (!category) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Category not found" })
            );
        }

        const meal = new Meal({
            restaurant_id: req.body.restaurant_id,
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? req.file.path : "",
            rating: req.body.rating,
            is_available: req.body.is_available,
        });

        await meal.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({
                message: "Meal created",
                meal
            })
        );

    } catch (error) {
        next(error);
    }
};



const updateMeal = async function (req, res, next) {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Meal not found" })
            );
        }

        // Validate restaurant_id if provided
        if (req.body.restaurant_id) {
            const restaurant = await Restaurant.findById(req.body.restaurant_id);
            if (!restaurant) {
                return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                    Jsend.fail({ message: "Restaurant not found" })
                );
            }
        }

        // Validate category_id if provided
        if (req.body.category_id) {
            const category = await Category.findById(req.body.category_id);
            if (!category) {
                return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                    Jsend.fail({ message: "Category not found" })
                );
            }
        }

        const allowedFields = [
            "restaurant_id",
            "category_id",
            "name",
            "description",
            "price",
            "rating",
            "is_available"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                meal[field] = req.body[field];
            }
        });

        // Handle image upload
        if (req.file) {
            if (meal.image) {
                fs.unlink(meal.image, (err) => {
                    if (err) console.error("Failed to delete old meal image:", err.message);
                });
            }
            meal.image = req.file.path;
        }

        await meal.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Meal updated",
                meal
            })
        );

    } catch (error) {
        next(error);
    }
};



const deleteMeal = async function (req, res, next) {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Meal not found" })
            );
        }

        // Delete the image file if it exists
        if (meal.image) {
            fs.unlink(meal.image, (err) => {
                if (err) console.error("Failed to delete meal image:", err.message);
            });
        }

        await Meal.findByIdAndDelete(req.params.id);

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Meal deleted"
            })
        );

    } catch (error) {
        next(error);
    }
};



const toggleAvailability = async function (req, res, next) {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Meal not found" })
            );
        }

        meal.is_available = !meal.is_available;
        await meal.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: `Meal ${meal.is_available ? "available" : "unavailable"}`,
                meal
            })
        );

    } catch (error) {
        next(error);
    }
};



module.exports = {
    browseMeals,
    getMeal,
    addMeal,
    updateMeal,
    deleteMeal,
    toggleAvailability
};
