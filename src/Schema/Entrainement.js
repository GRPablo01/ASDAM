// Création Schema Entrainement

const mongoose = require('mongoose');

// Exemple d'énumération des équipes et catégories
const equipesEnum = ["ASDAM"];
const categoriesEnum = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
'SeniorA','SeniorB','U23','SeniorC','SeniorD']

const EntrainementSchema = new mongoose.Schema({
  equipe: { type: String, enum: equipesEnum, required: true }, // L'équipe qui s'entraîne

  categorie: { type: String, enum: categoriesEnum, required: true }, // Catégorie de l'équipe

  date: { type: Date, required: true }, // Date et heure de l'entraînement

  lieu: { type: String, required: true }, // Lieu ou stade de l'entraînement

  duree: { type: Number, default: 90 }, // Durée en minutes (optionnel, défaut 90min)

  description: { type: String, default: "" } // Infos complémentaires (optionnel)
});

module.exports = mongoose.model('Entrainement', EntrainementSchema);
