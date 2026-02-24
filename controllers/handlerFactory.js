/* eslint-disable no-unused-vars */
import { catchAsync } from "../utils/catchAsyncFeature.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found with that ID ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: "success",
      message: "Document deleted successfully",
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(`No document found with that ID ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(
        new AppError(`No document found with that ID ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // EXECUTE QUERY

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // page and limit for pagination and total count of documents for pagination metadata
    // Page and limit is instance variables in APIFeatures class, we can access them after calling paginate() method
    const { page, limit } = features;
    // Get total count of documents
    const totalDocuments = await Model.countDocuments(filter);

    // // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / (req.query.limit * 1 || 10));

    // 6) Aliasing

    // Query executing
    const docs = await features.query;

    res.status(200).json({
      status: "success",
      requestAt: req.requestTime,
      results: docs.length,
      sortedBy: req.query.sort,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalDocuments,
      totalPages,
      data: {
        docs,
      },
    });
  });

export default {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
