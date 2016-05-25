var mongoose = require('mongoose');

var newsPostSchema = new mongoose.Schema({
  text: String,
  title: String,
  date: String,
  photos: [String]
});

module.exports = mongoose.model("NewsPost", newsPostSchema);
