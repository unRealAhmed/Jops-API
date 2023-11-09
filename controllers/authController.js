const asyncHandler = require('../utilities/asyncHandler')


exports.signup = asyncHandler(async (req, res, next) => {
  res.send('new user')
})
exports.login = asyncHandler(async (req, res, next) => {
  res.send('logged user')
})

