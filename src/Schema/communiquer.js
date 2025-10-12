const mongoose = require('mongoose');

const communiqueSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  auteur: { type: String, required: true },
  date: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  image: { type: String, default: '/assets/LOGO.png'},
  visible: { type: Boolean, default: true },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Communique', communiqueSchema);
