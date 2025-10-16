const mongoose = require('mongoose');

const equipeSchema = new mongoose.Schema({
  equipe: String,
  pts: Number,
  jo: Number,
  g: Number,
  n: Number,
  p: Number,
  f: Number,
  bp: Number,
  bc: Number,
  pe: Number,
  dif: Number
});

const classementSchema = new mongoose.Schema({
  categorie: { type: String, required: true }, // ex: "Départemental 4 - Poule A"
  equipes: [equipeSchema] // tableau d'équipes
});

module.exports = mongoose.model('Classement', classementSchema);
