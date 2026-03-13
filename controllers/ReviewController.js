const Review = require("../models/Review");
const Meal = require("../models/Meal");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");

// GET /api/reviews?meal_id=...
const getReviews = async function (req, res, next) {
    try {
        const { page, limit, skip } = paginate(req);
        const filter = req.query.meal_id ? { meal_id: req.query.meal_id } : {};

        const reviews = await Review.find(filter)
            .populate("user_id", "name")
            .populate("meal_id", "name")
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(filter);

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                reviews,
                pagination: { total, page, pages: Math.ceil(total / limit), limit }
            })
        );
    } catch (error) {
        next(error);
    }
};

// POST /api/reviews
const addReview = async function (req, res, next) {
    try {
        const meal = await Meal.findById(req.body.meal_id);
        if (!meal) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Meal not found" })
            );
        }

        const existing = await Review.findOne({ user_id: req.user.id, meal_id: req.body.meal_id });
        if (existing) {
            return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
                Jsend.fail({ message: "You already reviewed this meal" })
            );
        }

        const review = await Review.create({
            user_id: req.user.id,
            meal_id: req.body.meal_id,
            rating: req.body.rating,
            comment: req.body.comment,
        });

        // Update meal average rating
        const allReviews = await Review.find({ meal_id: req.body.meal_id });
        meal.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await meal.save();

        return res.status(Constants.STATUSCODE.CREATED).json(
            Jsend.success({ message: "Review added", review })
        );
    } catch (error) {
        next(error);
    }
};

// DELETE /api/reviews/:id
const deleteReview = async function (req, res, next) {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(Constants.STATUSCODE.NOT_FOUND).json(
                Jsend.fail({ message: "Review not found" })
            );
        }

        // Only owner or admin can delete
        if (review.user_id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(Constants.STATUSCODE.FORBIDDEN).json(
                Jsend.fail({ message: "Unauthorized" })
            );
        }

        await Review.findByIdAndDelete(req.params.id);

        // Update meal average rating
        const meal = await Meal.findById(review.meal_id);
        if (meal) {
            const allReviews = await Review.find({ meal_id: review.meal_id });
            meal.rating = allReviews.length ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
            await meal.save();
        }

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({ message: "Review deleted" })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { getReviews, addReview, deleteReview };
