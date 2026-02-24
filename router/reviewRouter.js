import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
  updateReview,
  setTourUserIds,
} from "../controllers/reviewController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const reviewRouter = express.Router({
  mergeParams: true,
});

// Post / Get reviews for a specific tour
// /tours/:tourId/reviews
// /reviews

// GET /tours/:tourId/reviews
// GET /reviews

reviewRouter.use(protect);

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

reviewRouter
  .route("/:id")
  .get(getReviewById)
  .delete(restrictTo("user", "admin"), deleteReview)
  .patch(restrictTo("user", "admin"), updateReview);

export default reviewRouter;
