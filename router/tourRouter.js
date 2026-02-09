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
} from "../controllers/tourController.js";

import { protect, restrictTo} from "../controllers/authController.js";

const tourRouter = express.Router();

tourRouter.route("/top5").get(aliasTopTours, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);

// Standard CRUD routes
tourRouter.route("/").get(protect, getAllTours).post(protect, createTour);
tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default tourRouter;
