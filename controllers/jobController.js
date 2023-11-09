const asyncHandler = require('../utilities/asyncHandler')
const Job = require('../models/jobModel')
const APIFeatures = require('../utilities/apiFeatures')
const AppError = require('../utilities/appErrors')





exports.getAllJobs = asyncHandler(async (req, res, next) => {

  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const jobs = await features.query;

  res.status(200).json({
    status: 'success',
    results: jobs.length,
    jobs
  });
});

exports.getJob = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.id;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    return next(new AppError('No job found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    job,
  });
});


exports.createJob = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id
  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    newJob
  });
});

exports.updateJob = asyncHandler(async (req, res, next) => {

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    updatedJob
  });
});

exports.deleteJob = asyncHandler(async (req, res, next) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);

  if (!deletedJob) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});