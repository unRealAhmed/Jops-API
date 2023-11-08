require("dotenv").config({ path: './config.env' }); // Load environmental variables

const express = require('express');
const errorController = require('./controllers/errorController');

const app = express();
const port = process.env.PORT || 8000;

const connectDatabase = require("./utilities/dataBase");

// Middleware: Parse JSON in the request body
app.use(express.json());

// Routes
// app.use('/api/v1/products', productRouter);

// Database Connection
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

