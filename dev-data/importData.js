import fs from "fs";
import Tour from "../models/tourModels.js";
import User from "../models/UserModel.js";
import Review from "../models/reviewsModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

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

const tourData = JSON.parse(
  fs.readFileSync("./dev-data/data/tours.json", "utf-8"),
);
const userData = JSON.parse(
  fs.readFileSync("./dev-data/data/users.json", "utf-8"),
);
const reviewData = JSON.parse(
  fs.readFileSync("./dev-data/data/reviews.json", "utf-8"),
);

const importData = async () => {
  try {
    await Tour.create(tourData);
    await User.create(userData, { validateBeforeSave: false });
    await Review.create(reviewData);
    console.log("All data successfully imported!");
  } catch (err) {
    console.error("Error importing data:", err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("All data successfully deleted!");
  } catch (err) {
    console.error("Error deleting data:", err);
  }
  process.exit();
};

// Command line arguments handling

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
