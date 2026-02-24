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
  getUserById,
  getMe,
} from "../controllers/userController.js";

const userRoute = express.Router();

// Authentication routes
userRoute.route("/signup").post(signUp);
userRoute.route("/forgot-password").post(forgotPassword);
userRoute.route("/reset-password/:token").patch(resetPassword);
userRoute.route("/login").post(login);
userRoute.route("/update-my-password").patch(protect, updatePassword);

userRoute.use(protect);

// User routes
// protect all routes after this middleware


//Always put specific routes before dynamic routes.
userRoute.route("/").get(getAllUsers);
userRoute.route("/me").get(getMe, getUserById);
userRoute.route("/updateMe").patch(updateUser);
userRoute.route("/deleteMe").delete(deleteUser);
userRoute.route("/:id").get(getUserById);


// for "admin" role only
// userRoute.use(restrictTo("admin"));
// userRoute.route("/").get(getAllUsers);
// userRoute.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

export default userRoute;
