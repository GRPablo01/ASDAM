// models/Categorie.js
const mongoose = require('mongoose');

// 🔹 Schéma d'un joueur avec jour et status
const joueurSchema = new mongoose.Schema({
  id: String,
  nom: String,
  prenom: String,
  jour: String,      // déjà présent
  status: {          // nouveau champ
    type: String,
    default: 'absent' // tu peux mettre 'présent', 'absent', 'indéfini', etc.
  }
});

// 🔹 Schéma d'une catégorie
const categorieSchema = new mongoose.Schema({
  categorie: { type: String, required: true },
  joueur: [joueurSchema]
});

module.exports = mongoose.model('Categorie', categorieSchema);
