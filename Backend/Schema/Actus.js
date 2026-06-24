const mongoose = require('mongoose');

const actusSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    auteur: {
      type: String,
      default: 'admin',
      index: true,
    },

    categorie: {
      type: String,
      default: 'general',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Actus', actusSchema);