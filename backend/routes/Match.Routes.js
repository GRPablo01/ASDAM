const express = require('express');
const router = express.Router();
const matchController = require('../controller/match.Controller');
const Match = require('../../src/Schema/Match'); // 🔹 Bien importer le modèle

// Middleware coach
const verifyCoach = (req, res, next) => {
  if (!req.user || req.user.role !== 'coach') {
    return res.status(403).json({ message: 'Accès refusé : uniquement les coachs' });
  }
  next();
};

// Parsing user header
router.use((req, res, next) => {
  const userHeader = req.headers['x-user'];
  if (userHeader) {
    try {
      req.user = JSON.parse(userHeader);
    } catch (e) {
      console.error('Erreur parsing user header', e);
    }
  }
  next();
});

// Créer un match
router.post('/', verifyCoach, matchController.creerMatch);

// Récupérer tous les matchs
router.get('/', matchController.getAllMatches);

// Mettre à jour un match (scores, statut, minute)
// Ici tu peux envoyer un payload comme { scoreA, scoreB }
router.patch('/:id', verifyCoach, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    const updatedMatch = await Match.findByIdAndUpdate(id, payload, { new: true });
    res.json(updatedMatch);
  } catch (err) {
    console.error('Erreur update match:', err);
    res.status(500).json({ message: 'Erreur mise à jour match', error: err });
  }
});

module.exports = router;
