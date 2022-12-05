const express = require('express')
const { postRegister, postLogin, updateUser } = require('../controllers/usersController')
const isAuthenticated = require('../utils/isAuthenticated')

const router = express.Router()

router.post('/register', postRegister)
router.post('/login', postLogin)
router.patch('/updateUser', isAuthenticated, updateUser)

module.exports = router