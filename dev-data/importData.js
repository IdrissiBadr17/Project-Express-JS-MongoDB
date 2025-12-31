import fs from "fs";
import Tour from "../models/tourModels.js";
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
  fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8"),
);

const importTourData = async () => {
  try {
    await Tour.create(tourData);
    console.log("Tour data successfully imported!");
  } catch (err) {
    console.error("Error importing tour data:", err);
  }
  process.exit();
};
const deleteTourData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Tour data successfully deleted!");
  } catch (err) {
    console.error("Error deleting tour data:", err);
  }
  process.exit();
};


// Command line arguments handling

if (process.argv[2] === "--import") {
  importTourData();
} else if (process.argv[2] === "--delete") {
  deleteTourData();
}
