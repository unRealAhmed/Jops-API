const express = require('express');

// Import job controller methods
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Create a router instance
const router = express.Router();

// Define routes for jobs
router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

// Export the router
module.exports = router;
