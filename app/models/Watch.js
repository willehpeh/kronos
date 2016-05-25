var mongoose = require('mongoose');

var watchSchema = new mongoose.Schema({
  marque: String,
  nom: String,
  quantite: Number,
  reference: String,
  annee: String,
  description: String,
  categorie: String,
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
  photo_back: String,
  photo_quarter: String,
  extra_photos: [String]
});

module.exports = mongoose.model("Watch", watchSchema);
