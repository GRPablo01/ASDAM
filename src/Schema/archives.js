const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  file: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true }
});

module.exports = mongoose.model('Archive', archiveSchema);
