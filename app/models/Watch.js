var mongoose = require('mongoose');

var watchSchema = new mongoose.Schema({
  type: String,
  model: String,
  price: Number,
  photo: String,
  info: String
});

module.exports = mongoose.model("Watch", watchSchema);
