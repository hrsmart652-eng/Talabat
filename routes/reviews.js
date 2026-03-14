const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ReviewController = require("../controllers/ReviewController");
const ReviewValidator = require("../middlewares/validators/ReviewValidator");

// View reviews (optionally filtered by meal_id)
router.get("/", AuthMiddleware, ReviewValidator.getReviews(), ReviewController.getReviews);

// Rate a meal / leave a review
router.post("/", AuthMiddleware, ReviewValidator.addReview(), ReviewController.addReview);

// Delete a review (owner or admin)
router.delete("/:id", AuthMiddleware, ReviewValidator.deleteReview(), ReviewController.deleteReview);

module.exports = router;
