var mongoose = require('mongoose');

var pressPhotoSchema = new mongoose.Schema({
  photo: String,
  title: String,
  caption: String
});

module.exports = mongoose.model("PressPhoto", pressPhotoSchema);
