const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../../src/Schema/Event'); // chemin vers ton modèle Event

const router = express.Router();

// Créer dossier uploads si inexistant
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Multer config pour upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ➕ Créer un événement
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, coach, category, day, hour, endHour, level, duration } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newEvent = new Event({
      title,
      coach,
      category,
      day,        // reste string 'YYYY-MM-DD'
      hour,
      endHour,
      level,
      duration: Number(duration) || 1,
      imageUrl
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error('Erreur ajout événement:', err);
    res.status(500).json({ message: 'Erreur ajout événement', error: err.message });
  }
});

// 📋 Récupérer tous les événements
router.get('/', async (_req, res) => {
  try {
    const events = await Event.find().lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération', error: err.message });
  }
});

// 📝 Modifier un événement
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, coach, category, day, hour, endHour, level, duration } = req.body;
    const updateData = { title, coach, category, day, hour, endHour, level, duration: Number(duration) || 1 };

    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Événement introuvable' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Erreur modification', error: err.message });
  }
});

// ❌ Supprimer un événement
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Événement introuvable' });
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression', error: err.message });
  }
});

module.exports = router;
