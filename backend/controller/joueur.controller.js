const User = require('../../src/Schema/user'); // Assure-toi que le modèle s'appelle bien User

// Récupérer uniquement les joueurs
const getJoueurs = async (req, res) => {
  try {
    const joueurs = await User.find({ role: 'joueur' });
    res.json(joueurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export correct en CommonJS
module.exports = { getJoueurs };
