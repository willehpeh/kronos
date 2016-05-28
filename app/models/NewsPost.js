var mongoose = require('mongoose');

var newsPostSchema = new mongoose.Schema({
  text: String,
  title: String,
  photos: [String],
  thumbnails: [String],
  created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model("NewsPost", newsPostSchema);
