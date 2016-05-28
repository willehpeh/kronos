var mongoose = require('mongoose');

var ambassadorSchema = new mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  thumbnail: String
});

module.exports = mongoose.model("Ambassador", ambassadorSchema);
