var mongoose = require('mongoose');

var watchSchema = new mongoose.Schema({
  show: Boolean,
  marque: String,
  nom: String,
  quantite: Number,
  reference: String,
  annee: String,
  description: String,
  categorie: String,
  gamme: String,
  disponible: String,
  prix: String,
  taille: String,
  mouvement: String,
  garantie: String,
  limite: String,
  etancheite: String,
  glace: String,
  boitier: String,
  traitement: String,
  cadran: String,
  lunette: String,
  poids: String,
  photo_front: String,
  photo_front_thumbnail: String,
  photo_back: String,
  photo_back_thumbnail: String,
  photo_quarter: String,
  photo_quarter_thumbnail: String,
  extra_photos: [String],
  extra_photos_thumbnails: [String],
  created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Watch", watchSchema);
