const Archive = require('../../src/Schema/archives');

// GET toutes les archives
exports.getArchives = async (req, res) => {
  try {
    const archives = await Archive.find().sort({ date: -1 });
    res.json(archives);
  } catch (err) {
    console.error('❌ Erreur GET archives:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST nouvelle archive
exports.addArchive = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('Fichier requis');

    const { title, description, date } = req.body;
    const file = `/uploads/${req.file.filename}`;
    const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const archive = await Archive.create({ date, title, description, file, type });
    res.status(201).json(archive);
  } catch (err) {
    console.error('❌ Erreur POST archive:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
