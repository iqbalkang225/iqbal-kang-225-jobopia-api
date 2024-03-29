const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
    },
    position: {
      type: String,
      required: [true, 'Please provide the position which you are applying for'],
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending',
    },
    location: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobsSchema);

module.exports = Job;
