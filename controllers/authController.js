const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const asyncHandler = require('../utilities/asyncHandler');
const User = require('../models/userModel');
const createToken = require('../utilities/createToken');
const AppError = require('../utilities/appErrors');

// User signup
exports.signup = asyncHandler(async (req, res, next) => {
  // Create a new user with the provided data
  const newUser = await User.create({ ...req.body });

  // Hide the password in the response
  newUser.password = undefined;

  // Create a JWT token and send the response
  const token = createToken(res, newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    newUser,
  });
});

// User login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  // Find user by email and compare passwords
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.passwordMatching(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Hide the password in the response
  user.password = undefined;

  // Create a JWT token and send the response
  const token = createToken(res, user._id);
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

// Protect routes with authentication
exports.protect = asyncHandler(async (req, res, next) => {
  // Get the token from the request's authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token is provided
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // Check if the user associated with the token still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  const tokenIssuedAt = decoded.iat;

  // Check if the user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
    return next(new AppError('User recently changed the password! Please log in again.', 401));
  }

  // Grant access to the protected route by attaching the user object to the request
  req.user = currentUser;
  next();
});
