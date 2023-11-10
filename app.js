// Load environmental variables
require("dotenv").config({ path: './config.env' });

// Import necessary modules
const express = require('express');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require('cookie-parser');
const cors = require("cors");

// Import controllers and utility functions
const errorController = require('./controllers/errorController');
const jobRouter = require('./routes/jobRoutes');
const userRouter = require('./routes/userRoutes');
const connectDatabase = require("./utilities/dataBase");

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Parse cookies, enable CORS, and handle JSON parsing
app.use(cookieParser());
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.json({ limit: '100kb' }));

// Enhance security with various middleware
app.use(helmet()); // Set various HTTP headers for security
app.use(mongoSanitize()); // Sanitize data against NoSQL injection attacks
app.use(xss()); // Prevent XSS attacks
app.use(
  hpp({
    whitelist: [
      "company",
      "status",
      "position",
      "createdBy",
      "createdAt",
    ],
  })
);

// Define routes for jobs and users, protecting job routes with authentication
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/users', userRouter);

// Connect to the database
connectDatabase();

// Error Handling Middleware: Handle requests for undefined routes
app.all("*", (req, _, next) => {
  const err = new Error(`Can't Find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

// Error Controller: Handle errors generated during request processing
app.use(errorController);

// Start the server and listen on the defined port
try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error('An error occurred while starting the server:', error);
}
