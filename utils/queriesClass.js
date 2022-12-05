const Job = require("../models/jobsModel")

class queriesClass {
  constructor(query) {
    this.query = query
    this.queryObject
  }

  findAllJobs() {
    this.queryObject = { createdBy: this.query.signedInUser }
    return this
  }

  filterByPosition() {
    if(!this.query.search) return this
    this.queryObject = { ...this.queryObject ,position: {$regex: this.query.search, $options: 'i' }}
    return this
  }

  filterByStatus() {
    if(this.query.status && this.query.status !== 'all') {
      this.queryObject = { ...this.queryObject , status: this.query.status}
    }
    return this
  }

  filterByjobType() {
    if(this.query.jobType && this.query.jobType !== 'all') {
      this.queryObject = { ...this.queryObject , jobType: this.query.jobType}
    }
    return this
  }

}

module.exports = queriesClass