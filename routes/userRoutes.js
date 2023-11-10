const express = require('express');

// Import authentication controller methods
const {
  signUp,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authController');

const { getAllUsers, deleteUser } = require('../controllers/userController');

// Create a router instance
const router = express.Router();

// Public routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

// Protected routes (requires authentication)
router.use(protect);

// Routes restricted to admin only
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser);

// Export the router
module.exports = router;
