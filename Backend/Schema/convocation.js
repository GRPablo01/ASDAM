const mongoose = require('mongoose');

// ==========================
// Schéma joueur avec disponibilité
// ==========================
const joueurSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true 
  },

  nom: { 
    type: String, 
    required: true 
  },

  prenom: { 
    type: String 
  },

  email: { 
    type: String,
    required: true
  },

  present: { 
    type: String,
    enum: ['oui', 'non', 'non_repondu'],
    default: 'non_repondu'
  }
});

// ==========================
// Schéma convocation
// ==========================
const convocationSchema = new mongoose.Schema({
  
  // 🔹 Liste des joueurs convoqués
  joueurs: {
    type: [joueurSchema],
    required: [true, 'Le tableau de joueurs est obligatoire'],
    validate: [
      arr => arr.length > 0,
      'Il doit y avoir au moins un joueur'
    ]
  },

  // 🔹 Ancien champ équipe
  equipe: {
    type: String,
    required: true
  },

  // 🔹 Nouvelle équipe domicile
  equipeDom: {
    type: String,
    required: true
  },

  // 🔹 Nouvelle équipe extérieure
  equipeExt: {
    type: String,
    required: true
  },

  // 🔹 Type de compétition
  TypeCompetition: {
    type: String,
    required: true
  },

  // 🔹 Nom du match
  match: {
    type: String,
    required: true
  },

  // 🔹 Date du match
  dateMatch: {
    type: Date,
    required: true
  },

  // 🔹 Lieu du match
  lieu: {
    type: String,
    required: true
  },

  // 🔹 Date de création
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Convocation', convocationSchema);