const { StatusCodes } = require("http-status-codes")
const User = require("../models/usersModel")
const AppError = require("../utils/appError")
const catchAsyncErrors = require("../utils/catchAsyncErrors")

const postRegister = catchAsyncErrors( async (req, res, next) => {
  const user = await User.create(req.body)
  const {name, lastName, email, location, _id: userId} = user

  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      user: { name, lastName, email, location, userId, token }
    }
  })
})

const postLogin = catchAsyncErrors( async(req, res, next) => {
  
  const { email, password } = req.body
  if(!email || !password) return next(new AppError('Missing fields', StatusCodes.BAD_REQUEST))

  const user = await User.findOne({ email })
  if(!user) return next(new AppError('Invalid credentials', StatusCodes.NOT_FOUND))

  const arePasswordsCorrect = await user.comparePasswords(password)
  if(!arePasswordsCorrect) return next(new AppError('Invalid credentials', StatusCodes.NOT_FOUND))

  const token = user.createJWT()
  const {name, lastName, email: userEmail, location, _id: userId} = user
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: { 
      user: { name, lastName, email: userEmail, location, userId, token }
     }
  })
})

const updateUser = catchAsyncErrors( async(req, res, next) => {
  console.log(req.body)

  const user = await User.findOneAndUpdate(
      {_id: req.user._id}, 
      req.body,
      {new: true, runValidators: true}).select('-password -__v')
  
  const {name, lastName, email, location, _id: userId} = user

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user: { name, lastName, email, location, userId, token }
    }
  })

})

module.exports = {
  postRegister,
  postLogin,
  updateUser
}