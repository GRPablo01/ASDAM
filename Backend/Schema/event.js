const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    lieu: {
      type: String,
      required: true,
    },

    heureDebut: {
      type: String,
      required: true, // ex: "14:00"
    },

    heureFin: {
      type: String,
      required: true, // ex: "16:00"
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Event', eventSchema);