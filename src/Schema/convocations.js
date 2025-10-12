const mongoose = require('mongoose');

const ConvocationSchema = new mongoose.Schema({
  match: { type: String, required: true },
  equipe: { type: String, required: true },
  joueurs: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      nom: String,
      prenom: String,
      equipe: String,
      role: String
    }
  ],
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  mailCoach: { type: String, required: true } // <-- ajout du mail du coach
}, { timestamps: true });

module.exports = mongoose.model('Convocation', ConvocationSchema);
