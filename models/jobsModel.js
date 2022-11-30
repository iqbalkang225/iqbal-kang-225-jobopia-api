const mongoose = require('mongoose')

const jobsSchema = new mongoose.Schema({
  
})

const Job = mongoose.model('Job', jobsSchema)

module.exports = Job