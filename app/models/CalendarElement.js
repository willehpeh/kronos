var mongoose = require('mongoose');

var calendarElementSchema = new mongoose.Schema({
  text: String,
  date: String,
  place: String,
  photo: String
});

module.exports = mongoose.model("CalendarElement", calendarElementSchema);
