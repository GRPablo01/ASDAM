// src/controller/joueur.controller.js
const User = require('../../src/Schema/user'); // ton modèle Mongoose ou autre ORM

// Récupère tous les joueurs
const getJoueurs = async (req, res) => {
  try {
    // Filtre les utilisateurs avec role "joueur"
    const joueurs = await User.find({ role: 'joueur' });
    res.json(joueurs);
  } catch (err) {
    console.error('Erreur getJoueurs:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des joueurs' });
  }
};

module.exports = { getJoueurs };
