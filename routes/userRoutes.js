const express = require('express');

// Import authentication controller methods
const { signUp, login, forgetPassword, resetPassword, updatePassword, protect, restrictTo } = require('../controllers/authController');

const { getAllUsers, deleteUser } = require('../controllers/userController')

// Create a router instance
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.use(protect, restrictTo('admin'));

router.get('/', getAllUsers)
router.delete('/:id', deleteUser)


// Export the router
module.exports = router;
