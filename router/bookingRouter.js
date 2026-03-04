import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { getCheckoutSession } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.use(protect);

bookingRouter.get("/checkout-session/:tourId", protect, getCheckoutSession);

export default bookingRouter;
