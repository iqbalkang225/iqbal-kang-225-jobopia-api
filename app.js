const express = require('express')
const {StatusCodes} = require('http-status-codes')

const usersRouter = require('./routes/usersRouter')
const jobsRouter = require('./routes/jobRouter')
const errorHandler = require('./controllers/errorsController')
const AppError = require('./utils/appError')
const isAuthenticated = require('./utils/isAuthenticated')


const app = express()

app.use(express.json())

// routes middlewares
app.use('/api/v1/jobs', isAuthenticated, jobsRouter)
app.use('/api/v1/user', usersRouter)

app.use('*', (req, res, next) => {
  next(new AppError('Page not found', StatusCodes.NOT_FOUND))
})

// global error handler
app.use(errorHandler)

module.exports = app