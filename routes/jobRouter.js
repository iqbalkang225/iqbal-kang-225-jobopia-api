const express = require('express')
const { getJobs, postJob, updateJob, deleteJob, getStats } = require('../controllers/jobsController')

const router = express.Router()

router.get('/stats', getStats)
router.get('/', getJobs )
router.post('/', postJob )
router.patch('/:id', updateJob )
router.delete('/:id', deleteJob )

module.exports = router
