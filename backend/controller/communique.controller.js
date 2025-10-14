// controller/communique.controller.js
const Communique = require('../../src/Schema/communiquer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads'); // ../uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
exports.uploadImage = upload.single('image');

// --- Ajouter un communiqué ---
exports.addCommunique = async (req, res) => {
  try {
    const { titre, contenu, auteur, tags } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/assets/LOGO.png';

    const communique = new Communique({
      titre,
      contenu,
      auteur,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      image: imageUrl,
      visible: true,
      likes: 0,
      date: new Date(),
    });

    await communique.save();
    res.status(201).json(communique);
  } catch (err) {
    console.error('Erreur addCommunique :', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du communiqué', err });
  }
};

// --- Récupérer tous les communiqués visibles ---
exports.getCommuniques = async (req, res) => {
  try {
    const communiques = await Communique.find({ visible: true }).sort({ date: -1 });
    res.status(200).json(communiques);
  } catch (err) {
    console.error('Erreur getCommuniques :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des communiqués', err });
  }
};

// --- Ajouter un like ---
exports.likeCommunique = async (req, res) => {
  try {
    const communique = await Communique.findById(req.params.id);
    if (!communique) return res.status(404).json({ message: 'Communiqué introuvable' });

    communique.likes += 1;
    await communique.save();
    res.status(200).json(communique);
  } catch (err) {
    console.error('Erreur likeCommunique :', err);
    res.status(500).json({ message: 'Erreur lors du like', err });
  }
};

// --- Dislike ---
exports.dislikeCommunique = async (req, res) => {
  try {
    const communique = await Communique.findById(req.params.id);
    if (!communique) return res.status(404).json({ message: 'Communiqué introuvable' });

    communique.likes = Math.max(0, communique.likes - 1);
    await communique.save();
    res.status(200).json(communique);
  } catch (err) {
    console.error('Erreur dislikeCommunique :', err);
    res.status(500).json({ message: 'Erreur lors du dislike', err });
  }
};

// ===== Supprimer un communiqué (et son image) =====
exports.supprimerCommunique = async (req, res) => {
  try {
    const { id } = req.params;
    const communique = await Communique.findById(id);
    if (!communique) return res.status(404).json({ message: 'Communiqué introuvable' });

    if (communique.image && !communique.image.includes('/assets/LOGO.png')) {
      const filePath = path.join(__dirname, '../../', communique.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Communique.findByIdAndDelete(id);
    res.status(200).json({ message: 'Communiqué supprimé' });
  } catch (err) {
    console.error('Erreur suppression communiqué :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression', err });
  }
};