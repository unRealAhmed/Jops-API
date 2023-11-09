const express = require('express');

// Import authentication controller methods
const { signup, login } = require('../controllers/authController');

// Create a router instance
const router = express.Router();

// Define routes for authentication
router.post('/signup', signup);
router.post('/login', login);

// Export the router
module.exports = router;
