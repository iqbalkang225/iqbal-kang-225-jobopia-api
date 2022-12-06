const catchAsyncErrors = require('../utils/catchAsyncErrors')
const appError = require('../utils/appError')
const Job = require('../models/jobsModel')
const { StatusCodes } = require('http-status-codes')
const queriesClass = require('../utils/queriesClass')
const { default: mongoose } = require('mongoose')

const getJobs = catchAsyncErrors( async (req, res, next) => {

  const signedInUser = req.user._id
  req.query.signedInUser = signedInUser

  const queries = new queriesClass(req.query)
                      .findAllJobs()
                      .filterByPosition()
                      .filterByStatus()
                      .filterByjobType()
                      .sort()


  const jobs = await Job.find(queries.queryObject)

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: jobs.length,
    data: { jobs }
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
  console.log(job)

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

const getStats = catchAsyncErrors( async(req, res, next) => {
  const signedInUser = req.user._id

  let stats = await Job.aggregate([
    {
      $match: {createdBy: mongoose.Types.ObjectId(signedInUser)}
    },
    {
      $group: { _id: '$status', count: {$sum : 1} }
    }
  ])

  stats = stats.reduce((acc, curr) => {
    const {_id, count} = curr
    acc[_id] = count
    return acc
  }, {})

  let monthlyApplications = await Job.aggregate([
    {
      $match: {createdBy: mongoose.Types.ObjectId(signedInUser)}
    },
    {
      $group: {
        _id: { year: {$year: '$createdAt'}, month: {$month: '$createdAt'} },
        count: { $sum: 1 }
      }
    },
    { $sort: {'_id.year': -1, '_id.month': -1} },
    { $limit: 6 }
  ])


  res.status(StatusCodes.OK).json({
    status: 'success',
    results: stats.length,
    data: { stats }
  })

  
})

module.exports = {
  getJobs,
  postJob,
  updateJob,
  deleteJob,
  getStats
}