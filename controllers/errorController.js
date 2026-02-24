/* eslint-disable no-unused-vars */
import AppError from "../utils/appError.js";

/* =======================
   DEV ERROR RESPONSE
======================= */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

/* =======================
   MONGOOSE ERROR HANDLERS
  ======================= */

// Invalid MongoDB ObjectId
const handleCastErrorDB = (err) => {
  console.log("Cast error Detected....");
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Duplicate field value
const handleDuplicateFieldsDB = (err) => {
  console.log("Duplicate error Detected....");
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

// Validation errors
const handleValidationErrorDB = (err) => {
  console.log("Validation error Detected....");
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// JWT Errors
const handleJWTError = (err) => {
  console.log("JWT error Detected....");
  return new AppError("Invalid token. Please log in again!", 401);
};

// JWT Expired Errors
const handleJWTExpiredError = (err) => {
  console.log("JWT expired error Detected....");
  return new AppError("Your token has expired! Please log in again.", 401);
};

/* =======================
   GLOBAL ERROR MIDDLEWARE
======================= */
export const errorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = {
    ...err,
    name: err.name,
    message: err.message,
  };

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  if (error.name === "JsonWebTokenError") error = handleJWTError(error);
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError(error);

  sendErrorDev(error, res);
};
