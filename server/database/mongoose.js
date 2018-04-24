var mongoose = require('mongoose');

process.env.MONGODB_URI = 'mongodb://localhost:27017/Hypertube-api'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};