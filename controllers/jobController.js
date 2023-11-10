const moment = require('moment');
const mongoose = require('mongoose');


const asyncHandler = require('../utilities/asyncHandler');
const Job = require('../models/jobModel');
const APIFeatures = require('../utilities/apiFeatures');
const AppError = require('../utilities/appErrors');

// Get all jobs
exports.getAllJobs = asyncHandler(async (req, res, next) => {
  // Create an instance of APIFeatures for query manipulation
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  // Execute the query and get jobs
  const jobs = await features.query;

  // Send the response
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    jobs,
  });
});

// Create a new job
exports.createJob = asyncHandler(async (req, res, next) => {
  console.log(req.user.id);
  // Set createdBy field to the user's ID
  req.body.createdBy = req.user.id;

  // Create a new job
  const newJob = await Job.create(req.body);

  // Send the response
  res.status(201).json({
    status: 'success',
    newJob,
  });
});

// Update a job
exports.updateJob = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.id;
  const { company, position } = req.body;

  // Find and update the job with the specified ID and createdBy
  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true, runValidators: true }
  );

  // Handle case where no job is found
  if (!updatedJob) {
    return next(new AppError('No job found with that ID', 404));
  }

  // Send the response
  res.status(201).json({
    status: 'success',
    updatedJob,
  });
});

// Delete a job
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  // Find and delete the job with the specified ID and createdBy
  const deletedJob = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  // Handle case where no job is found
  if (!deletedJob) {
    return next(new AppError('No job found with that ID', 404));
  }

  // Send the response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Show job application statistics
exports.showStats = asyncHandler(async (req, res) => {
  // Get stats based on job status
  const stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Transform stats into an object
  const formattedStats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // Default stats
  const defaultStats = {
    pending: formattedStats.pending || 0,
    interview: formattedStats.interview || 0,
    declined: formattedStats.declined || 0,
  };

  // Get monthly applications
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  // Format monthly applications
  monthlyApplications = monthlyApplications
    .map((item) => ({
      date: moment().month(item._id.month - 1).year(item._id.year).format('MMM Y'),
      count: item.count,
    }))
    .reverse();

  // Send the response
  res.status(200).json({ defaultStats, monthlyApplications });
});

