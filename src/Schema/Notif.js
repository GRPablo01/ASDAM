// Création Schema Notification

const mongoose = require('mongoose');

// Exemple d'énumération des types de notification
const typeNotifEnum = ["message", "alerte"];

const NotificationSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // L'utilisateur qui reçoit la notif

  type: { type: String, enum: typeNotifEnum, required: true }, // "message" ou "alerte"

  contenu: { type: String, required: true }, // Texte de la notification

//   lu: { type: Boolean, default: false }, // Si l'utilisateur a lu la notification

  date: { type: Date, default: Date.now } // Date de création
});

// Optionnel : méthode pour compter les notifications non lues
NotificationSchema.statics.countNonLues = function(userId) {
  return this.countDocuments({ utilisateurId: userId, lu: false });
};

module.exports = mongoose.model('Notification', NotificationSchema);
