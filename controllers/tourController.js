/* eslint-disable no-unused-vars */
import Tour from "../models/tourModels.js";
import APIFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsyncFeature.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";

const aliasTopTours = (req, res, next) => {
  req.url =
    "/?sort=-ratingsAverage,price&fields=ratingsAverage,price,name,difficulty,summary&limit=5";

  next();
};

const getAllTours = factory.getAll(Tour);

// const getTourById = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate("reviews");
//   if (!tour) {
//     return next(
//       new AppError(`No tour found with that ID ${req.params.id}`, 404),
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });

const getTourById = factory.getOne(Tour, { path: "reviews" });

const createTour = factory.createOne(Tour);

// const createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// });

const updateTour = factory.updateOne(Tour);

// const updateTour = catchAsync(async (req, res, next) => {
//   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updatedTour) {
//     return next(
//       new AppError(`No tour found with that ID ${req.params.id}`, 404),
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       updatedTour,
//     },
//   });
// });

const deleteTour = factory.deleteOne(Tour);

// const deleteTour = catchAsync(async (req, res, next) => {
//   const deletedTour = await Tour.findByIdAndDelete(req.params.id);

//   if (!deletedTour) {
//     return next(
//       new AppError(`No tour found with that ID ${req.params.id}`, 404),
//     );
//   }
//   res.status(200).json({
//     status: "success",
//     message: "Tour deleted successfully",
//   });
// });

/// Aggregate PipeLine
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            { $subtract: ["$_id", 1] },
          ],
        },
      },
    },
    { $project: { _id: 0 } },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: {
      plan,
    },
  });
});

export {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
