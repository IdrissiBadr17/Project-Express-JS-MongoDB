import User from "../models/UserModel.js";
import { catchAsync } from "../utils/catchAsyncFeature.js";
import AppError from "../utils/appError.js";
import factory from "./handlerFactory.js";
import multer from "multer";
import sharp from "sharp";

// Configure multer for file uploads
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// Store uploaded files in memory for processing with Sharp
const multerStorage = multer.memoryStorage();

// Filter to only allow image uploads
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

// Initialize multer with the defined storage and file filter
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Middleware to handle single file upload for user photo
const uploadUserPhoto = upload.single("photo");

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Here you can add code to resize the image using a library like Sharp
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const getMe = (req, res, next) => {
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
  // If there's a file uploaded, add the filename to the filteredBody
  if (req.file) filteredBody.photo = req.file.filename;
  console.log(filteredBody);
  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
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

export {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
};
