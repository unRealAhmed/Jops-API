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

// Get a specific job
exports.getJob = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  // Find the job with the specified ID and createdBy
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  // Handle case where no job is found
  if (!job) {
    return next(new AppError('No job found with that ID!', 404));
  }

  // Send the response
  res.status(200).json({
    status: 'success',
    job,
  });
});

// Create a new job
exports.createJob = asyncHandler(async (req, res, next) => {
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
