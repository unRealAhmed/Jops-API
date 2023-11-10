const asyncHandler = require('../utilities/asyncHandler');
const User = require('../models/userModel');
const AppError = require('../utilities/appErrors');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // Retrieve all users
  const users = await User.find();

  // Send the response
  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Find the user by ID and delete
  const user = await User.findByIdAndDelete(userId);

  // Handle case where no user is found
  if (!user) {
    return next(new AppError('No user found with that ID!', 404));
  }

  // Send the response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});