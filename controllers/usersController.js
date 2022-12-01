const { StatusCodes } = require("http-status-codes")
const User = require("../models/usersModel")
const AppError = require("../utils/appError")
const catchAsyncErrors = require("../utils/catchAsyncErrors")

const postRegister = catchAsyncErrors( async (req, res, next) => {
  console.log(req.body)
  const user = await User.create(req.body)
  const {name, _id: userId} = user

  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      user: { name, userId, token }
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
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: { 
      name: user.name,
      token
     }
  })
})

module.exports = {
  postRegister,
  postLogin
}