const asyncHandler = require('../utilities/asyncHandler')


exports.getAllJobs = asyncHandler(async (req, res, next) => {
  res.send('All Jobs')
})
exports.getJob = asyncHandler(async (req, res, next) => {
  res.send('job here')
})
exports.createJob = asyncHandler(async (req, res, next) => {
  res.send('new job')
})
exports.updateJob = asyncHandler(async (req, res, next) => {
  res.send('updated Job')
})
exports.deleteJob = asyncHandler(async (req, res, next) => {
  res.send('deleted job')
})