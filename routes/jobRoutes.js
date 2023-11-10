const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');


// Import job controller methods
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  showStats
} = require('../controllers/jobController');

// Create a router instance
const router = express.Router();

// Define routes for jobs
router.route('/').get(getAllJobs)

router.use(protect, restrictTo('admin'))

router.post('/').post(createJob);
router.route('/stats').get(showStats);
router.route('/:id').patch(updateJob).delete(deleteJob);
// Export the router
module.exports = router;
