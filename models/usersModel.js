const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 3,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value === this.password
      },
      message: 'Passwords do not match'
    }
  }
})

usersSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined
  next()
})

usersSchema.methods.createJWT = function() {
  return jwt.sign( 
    {name: this.name, userId: this._id}, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN } )
}

usersSchema.methods.comparePasswords = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password )
}

const User = mongoose.model("User", usersSchema)

module.exports = User