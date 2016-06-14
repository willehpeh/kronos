var mongoose = require('mongoose');

var accueilSchema = new mongoose.Schema({
  images: Number
});

module.exports = mongoose.model("Accueil", accueilSchema);
