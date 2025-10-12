// backend/Schema/Joueur.js ou Joueur.ts
import mongoose from 'mongoose';

const joueurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  categorie: { type: String, enum: ['U23', 'SeniorA', 'SeniorB', 'SeniorC', 'SeniorD'], default: 'U23' },
  statut: { type: String, enum: ['présent', 'absent'], default: 'présent' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  role: { type: String, default: 'joueur' } // <- important pour le filtre
});

export const Joueur = mongoose.model('Joueur', joueurSchema);
