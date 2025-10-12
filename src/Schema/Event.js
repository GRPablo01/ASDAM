const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coach: { type: String, required: true },
  category: { type: String, required: true },
  day: { type: String, required: true }, // reste string pour compatibilité Angular
  hour: { type: String, required: true },
  endHour: { type: String, required: true },
  level: { type: String, required: true },
  duration: { type: Number, default: 1 },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
