// Backend/Models/classement.model.js
const mongoose = require('mongoose');

const classementEntrySchema = new mongoose.Schema({
  position: { type: Number, required: true },
  equipe: { type: String, required: true },
  logo: { type: String },
  joues: { type: Number, default: 0 },
  gagnes: { type: Number, default: 0 },
  nuls: { type: Number, default: 0 },
  perdus: { type: Number, default: 0 },
  bp: { type: Number, default: 0 },
  bc: { type: Number, default: 0 },
  diff: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  forme: [{ type: String, enum: ['V', 'N', 'D'] }]
}, { _id: false });

const classementSchema = new mongoose.Schema({
  categorie: { type: String, required: true, index: true },
  saison: { type: String, required: true, default: '2024-2025' },
  dateGeneration: { type: Date, required: true, default: Date.now },
  entries: [classementEntrySchema],
  totalMatchs: { type: Number, default: 0 }
}, { timestamps: true });

// Index composé pour éviter les doublons
classementSchema.index({ categorie: 1, saison: 1, dateGeneration: -1 });

module.exports = mongoose.model('Classement', classementSchema);