const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(PORT, () => console.log('Listening on ' + PORT + '...'));
};

startServer();
