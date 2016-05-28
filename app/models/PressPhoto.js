var mongoose = require('mongoose');

var pressPhotoSchema = new mongoose.Schema({
  photo: String,
  thumbnail: String,
  title: String,
  caption: String,
  created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model("PressPhoto", pressPhotoSchema);
