const express = require('express')
const { getAllJobs } = require('../controllers/jobsController')

const router = express.Router()

router.get('/jobs', getAllJobs )

module.exports = router
