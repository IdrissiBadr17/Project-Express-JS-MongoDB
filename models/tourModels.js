import mongoose from "mongoose";
// import User from "./UserModel.js";
// import validator from "validator";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration "],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size "],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.66666 => 46.6666 => 47 => 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price "],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // Locations for Data Modeling  using Embedded Documents and GeoJSON
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // Child referencing for guides (normalization)
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
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

// Compound index for price and ratingsAverage
// 1 for ascending and -1 for descending
tourSchema.index({ price: 1, ratingsAverage: -1 });
// Index for slug field
// slug is a URL-friendly version of the tour name, typically used in the URL to identify the tour.
//  By creating an index on the slug field, we can improve the performance of queries that search for tours based on
// their slug, allowing for faster retrieval of tour data when accessed via URLs that include the slug.
tourSchema.index({ slug: 1 });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() but not on .insertMany() or .update()

/**
 * Embedding guides in the tour document (denormalization)
 *
 * This for Embedding guides in the tour document (denormalization) is not recommended
 * for production because it can lead to data inconsistency and increased storage requirements.
 *  If a guide's information changes, it would require updating all tour documents that embed that guide,
 * which can be error-prone and inefficient. Instead, it's better to reference guides by their ObjectId and populate the
 * guide data when needed, ensuring data consistency and efficient storage.
 *
 */

// tourSchema.pre("save", async function () {
//   const guides = await Promise.all(this.guides.map((id) => User.findById(id)));
//   this.guides = guides;
// });

// Virtual populate for reviews
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// Run before save and create
tourSchema.pre("save", function () {
  console.log("Document will be saved...");
});

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.startDates = Date.now();
});

tourSchema.post(/^find/, function () {
  console.log(`Query took ${Date.now() - this.startDates} milliseconds`);
});

tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
});

// AGGREGATION MIDDLEWARE

tourSchema.pre("aggregate", function () {
  console.log("Aggregation Middleware .....");
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
