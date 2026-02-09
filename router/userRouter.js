import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signUp,
  updatePassword,
} from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.route("/").get(getAllUsers);
userRoute.route("/updateMe").patch(protect, updateUser);
userRoute.route("/deleteMe").delete(protect, deleteUser);

// Authentication routes
userRoute.route("/signup").post(signUp);
userRoute.route("/forgot-password").post(forgotPassword);
userRoute.route("/reset-password/:token").patch(resetPassword);
userRoute.route("/login").post(login);
userRoute.route("/update-my-password").patch(protect, updatePassword);


export default userRoute;
