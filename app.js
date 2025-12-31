import express from "express";
import morgan from "morgan";
import tourRouter from "./router/tourRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
app.use(express.urlencoded({ extended: true }));
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

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}.....`);
});
