import Tour from "../models/tourModels.js";
import { catchAsync } from "../utils/catchAsyncFeature.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";
import Stripe from "stripe";
import Booking from "../models/bookingModel.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(
      new AppError(`No tour found with that ID ${req.params.tourId}`, 404),
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    customer_email: req.user.email,

    client_reference_id: req.params.tourId, // safer reference

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: tour.name,
            description: tour.summary,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});

const createBooking = factory.createOne("Booking");
const getBooking = factory.getOne("Booking");
const getAllBookings = factory.getAll("Booking");
const updateBooking = factory.updateOne("Booking");
const deleteBooking = factory.deleteOne("Booking");

export {
  getCheckoutSession,
  createBookingCheckout,
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
};
