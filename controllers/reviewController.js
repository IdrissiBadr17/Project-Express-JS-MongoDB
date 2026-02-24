/* eslint-disable no-unused-vars */
import { catchAsync } from "../utils/catchAsyncFeature.js";
import Review from "../models/reviewsModel.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";

// const getAllReviews = catchAsync(async (req, res, next) => {
//   // fist solution for nested routes
//   // Allow nested routes
//   // GET /tours/:tourId/reviews
//   // if (req.params.tourId) {
//   //   const reviews = await Review.find({ tour: req.params.tourId });
//   //   return res.status(200).json({
//   //     status: "success",
//   //     results: reviews.length,
//   //     data: {
//   //       reviews,
//   //     },
//   //   });
//   // }

//   // second solution for nested routes
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

const getAllReviews = factory.getAll(Review);

const getReviewById = factory.getOne(Review);

// const getReviewById = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(
//       new AppError(`No review found with that ID ${req.params.id}`, 404),
//     );
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });

const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// const createReview = catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       review: newReview,
//     },
//   });
// });

const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

export {
  getAllReviews,
  getReviewById,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
};
