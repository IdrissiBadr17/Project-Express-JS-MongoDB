import express from "express";
import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getToursDistances,
} from "../controllers/tourController.js";

import { protect, restrictTo } from "../controllers/authController.js";
import reviewRouter from "./reviewRouter.js";

const tourRouter = express.Router();

/**
 * @swagger
 * /api/v1/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Success
 */
tourRouter.route("/top5").get(aliasTopTours, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

tourRouter
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

tourRouter.route("/distances/:latlng/unit/:unit").get(getToursDistances);

// Standard CRUD routes
tourRouter
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// Nested routes Reviews & Users
// tourRouter
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

tourRouter.use("/:tourId/reviews", reviewRouter);

export default tourRouter;
