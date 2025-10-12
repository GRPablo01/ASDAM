const Communique = require('../../src/Schema/communiquer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Configuration Multer pour upload ---
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    // créer le dossier si inexistant
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // nom unique
  }
});

const upload = multer({ storage: storage });

// --- Middleware pour Express ---
exports.uploadImage = upload.single('image');

// --- Ajouter un communiqué ---
exports.addCommunique = async (req, res) => {
  try {
    const { titre, contenu, auteur, tags } = req.body;

    // Déterminer l'URL de l'image
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/assets/LOGO.png';

    const communique = new Communique({
      titre,
      contenu,
      auteur,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      image: imageUrl,
      visible: true,
      likes: 0,
      date: new Date()
    });

    await communique.save();
    res.status(201).json(communique);
  } catch (err) {
    console.error("Erreur addCommunique :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout du communiqué", err });
  }
};

// --- Récupérer tous les communiqués visibles ---
exports.getCommuniques = async (req, res) => {
  try {
    const communiques = await Communique.find({ visible: true }).sort({ createdAt: -1 });
    res.status(200).json(communiques);
  } catch (err) {
    console.error("Erreur getCommuniques :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des communiqués", err });
  }
};

// --- Ajouter un like ---
exports.likeCommunique = async (req, res) => {
  try {
    const { id } = req.params;
    const communique = await Communique.findById(id);
    if (!communique) return res.status(404).json({ message: "Communiqué introuvable" });

    communique.likes += 1;
    await communique.save();
    res.status(200).json(communique);
  } catch (err) {
    console.error("Erreur likeCommunique :", err);
    res.status(500).json({ message: "Erreur lors du like", err });
  }
};

// controllers/communiqueController.js
exports.dislikeCommunique = async (req, res) => {
  try {
    const { id } = req.params;
    const communique = await Communique.findById(id);
    if (!communique) return res.status(404).json({ message: "Communiqué introuvable" });

    communique.likes = Math.max(0, communique.likes - 1);
    await communique.save();
    res.status(200).json(communique);
  } catch (err) {
    console.error("Erreur dislikeCommunique :", err);
    res.status(500).json({ message: "Erreur lors du dislike", err });
  }
};

