const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })

const PORT = process.env.PORT || 8000

const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(PORT, () => console.log('Listening on ' + PORT + '...'))
}

startServer()