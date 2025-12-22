import express from "express";
import morgan from "morgan";
import tourRouter from "./router/tourRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
const uri = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectMongoDB().then(() => {
  console.log("Mongoose connection established");
});

// Middleware
// Body parser, reading data from body into req.body
// This allows us to access req.body in POST requests

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`./public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const getAllUsers = (req, res) => {
  res.status(500).json({
    state: "error",
    message: "This route is not yet defined!!",
  });
};

// Router Tour
app.use("/api/v1/tours", tourRouter);

app.route("/api/v1/users").get(getAllUsers);

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price "],
  },
});
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "The Forest",
  rating: 4.7,
  price: 4.99,
});
const testTour2 = new Tour({
  name: "The Forest Hiker",
  rating: 5.7,
  price: 8.99,
});

testTour
  .save()
  .then((doc) => {
    console.log("Tour saved successfully:", doc);
  })
  .catch((err) => {
    console.error("Error saving tour:", err);
  });

testTour2
  .save()
  .then((doc) => {
    console.log("Tour saved successfully:", doc);
  })
  .catch((err) => {
    console.error("Error saving tour:", err);
  });

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}.....`);
});
