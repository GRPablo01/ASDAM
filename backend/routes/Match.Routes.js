// routes/match.routes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controller/match.Controller'); // <-- adapte si besoin

// Middleware pour vérifier le rôle coach

const verifyCoach = (req, res, next) => {
  if (!req.user || req.user.role !== 'coach') {
    return res.status(403).json({ message: 'Accès refusé : uniquement les coachs' });
  }
  next();
};

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
router.patch('/:id', verifyCoach, matchController.updateMatch);

module.exports = router;
