const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  equipeA: { type: String, required: true },
  equipeB: { type: String, required: true },
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  categorie: { type: String, required: true },
  typeMatch: { 
    type: String, 
    enum: ['Championnat', 'Tournoi', 'Amical', 'Coup'], 
    default: 'Championnat' 
  },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  logoA: { type: String, default: 'assets/ASDAM.png' },
  logoB: { type: String },
  arbitre: { type: String, default: '' },
  stade: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
