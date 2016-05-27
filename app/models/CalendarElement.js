var mongoose = require('mongoose');

var calendarElementSchema = new mongoose.Schema({
  text: String,
  title: String,
  time: String,
  day: String,
  month: String,
  year: String,
  place: String,
  photo: String
});

module.exports = mongoose.model("CalendarElement", calendarElementSchema);
