const catchAsyncErrors = require('../utils/catchAsyncErrors')
const appError = require('../utils/appError')
const Job = require('../models/jobsModel')
const { StatusCodes } = require('http-status-codes')

const getJobs = catchAsyncErrors( async (req, res, next) => {
  const signedInUser = req.user._id
  const jobs =  await Job.find({createdBy: signedInUser}).sort('-createdAt')

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs
    }
  })
})

const postJob = catchAsyncErrors( async (req, res, next) => {
  req.body.createdBy = req.user._id

  const job = await Job.create(req.body)

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      job
    }
  })
})

const updateJob = catchAsyncErrors( async(req, res, next) => {

  const { position, company } = req.body
  const jobId = req.params.id

  if(!position && !company) return next(new appError('Missing fields', StatusCodes.BAD_REQUEST))

  const job = await Job.findOneAndUpdate({_id: jobId}, req.body, {new: true, runValidators: true})

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: { job }
  })
})

const deleteJob = catchAsyncErrors( async(req, res, next) => {
  const jobId = req.params.id

  const job = await Job.findOneAndRemove({_id: jobId})

  if(!job) return next(new appError(`No job was found with id ${jobId}`, StatusCodes.NOT_FOUND))

  res.status(StatusCodes.OK).json({
    status: 'success'
  })
})

module.exports = {
  getJobs,
  postJob,
  updateJob,
  deleteJob
}