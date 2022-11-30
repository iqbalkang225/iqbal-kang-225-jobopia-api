const express = require('express')
const { getJobs, postJob, updateJob, deleteJob } = require('../controllers/jobsController')

const router = express.Router()

router.get('/', getJobs )
router.post('/', postJob )
router.patch('/:id', updateJob )
router.delete('/:id', deleteJob )

module.exports = router
