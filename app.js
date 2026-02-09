import express from "express";
import morgan from "morgan";
import tourRouter from "./router/tourRouter.js";
import userRoute from "./router/userRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AppError from "./utils/appError.js";
import { errorHandling } from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

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

// 1- Limit requests from same API address
const limiter = rateLimit({
  max: 100, // max number of requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// 2- Set security HTTP headers using helmet
// helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(`./public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Data sanitization against NoSQL query injection
// Prevents operators like $gt, $or, etc. from being used in req.body, req.query, etc.
app.use(mongoSanitize());

// Data sanitization against XSS
// Clean user input from malicious HTML code
app.use(xss());

// Prevent parameter pollution
// Protect against HTTP Parameter Pollution attacks
// e.g., ?sort=price&sort=duration
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Router Tour
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRoute);

app.use((req, res, next) => {
  console.log("i am herre .....");
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server ⛔!`,
    404,
  );
  next(err);
});

app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}.....`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});
