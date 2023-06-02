const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')
const AppError = require('./appError')
const catchAsyncErrors = require('./catchAsyncErrors')

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return next(new AppError('Not authorized to access the path', StatusCodes.UNAUTHORIZED))

  const token = authHeader.split(' ')[1]

  try {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({ _id: isVerified.userId }).select('-password -__v')
    req.user = user
  } catch (error) {
    return next(new AppError('Not authorized to access the path', StatusCodes.UNAUTHORIZED))
  }

  next()
})

module.exports = isAuthenticated
