const AppError = require('../utilities/appErrors');

// Error Handling Functions

// Handle casting errors, e.g., invalid data type for a field.
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle validation errors, e.g., validation constraints not met.
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Send Response Functions

// Send detailed error response in the development environment.
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    stack: err.stack,
    message: err.message,
    error: err,
  });
};

// Send simplified error response in the production environment.
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      error: err,
    });
  }
};

// Error Controller Middleware

// Centralized error handling middleware.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastError(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationError(error);
    }

    sendProdError(error, res);
  }
};
