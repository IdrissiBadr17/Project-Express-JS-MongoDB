import User from "../models/UserModel.js";
import { catchAsync } from "../utils/catchAsyncFeature.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const getMe = (req, res, next) => {
  console.log("User:", req);
  req.params.id = req.user.id;
  next();
};

// const getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

const getAllUsers = factory.getAll(User);

// Update user details (excluding password)
const updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-my-password.",
        400,
      ),
    );
  }
  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObject(req.body, "fullName", "email");
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const getUserById = factory.getOne(User);

const deleteUser = factory.deleteOne(User);
// // Soft delete user
// const deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.user.id, { active: false });
//   if (!user) {
//     return next(new AppError("No user found with that ID", 404));
//   }
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

export { getAllUsers, updateUser, deleteUser, getUserById, getMe };
