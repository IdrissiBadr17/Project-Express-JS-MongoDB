import mongoose from "mongoose";
import Tour from "./tourModels.js";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// To prevent duplicate reviews from the same user for the same tour,
// we can create a compound index on the tour and user fields.
// This will ensure that each combination of tour and user is unique in the reviews collection.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "fullName",
  // });
  this.populate({
    path: "user",
    select: "fullName photo",
  });
});

// static method to calculate average ratings and quantity of ratings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/**
 *
 * POST SAVE HOOK
 * This hook will be called after a new review is created and saved to the database.
 * It will call the calcAverageRatings static method to update the average rating and quantity of ratings for
 * the associated tour.
 *
 */

reviewSchema.post("save", function () {
  // this points to current review
  // this.constructor points to the model that created the review, which is the Review model
  // we can use this.constructor to call the static method calcAverageRatings and pass the tour id to it
  this.constructor.calcAverageRatings(this.tour);
});

// PRE AND POST HOOKS FOR findByIdAndUpdate and findByIdAndDelete

// findByIdAndUpdate and findByIdAndDelete are shorthand for findOneAndUpdate and findOneAndDelete respectively.
//  So we can use a regular expression to match both of these methods in the pre hook.
reviewSchema.pre(/^findOneAnd/, async function () {
  this.r = await this.findOne();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
