// Schema/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  equipeA: { type: String, required: true },
  equipeB: { type: String, required: true },
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  categorie: { type: String, required: true },
  typeMatch: { type: String, enum: ['Championnat','Tournoi','Amical','Coup'], default: 'Championnat' },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  logoA: { type: String, default: '' },
  logoB: { type: String, default: '' },
  arbitre: { type: String, default: '' },
  stade: { type: String, default: '' },
  status: { type: String, enum: ['scheduled','live','finished'], default: 'scheduled' },
  duree: { type: Number, default: 90 },
  minute: { type: Number, default: 0 },
  heureDebut: { type: String, default: '' }, // format "HH:mm"
  heureFin: { type: String, default: '' }    // format "HH:mm"
});

module.exports = mongoose.model('Match', matchSchema);
