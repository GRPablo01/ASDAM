const express = require('express');
const router = express.Router();
const matchController = require('../controller/match.Controller'); // <-- chemin correct

// Middleware pour vérifier le rôle coach
const verifyCoach = (req, res, next) => {
  const user = req.user; // supposons que tu as un middleware d'authentification qui met user dans req
  if (!user || user.role !== 'coach') {
    return res.status(403).json({ message: 'Accès refusé : uniquement les coachs' });
  }
  next();
};

// Créer un match
router.post('/', verifyCoach, matchController.creerMatch);

// Récupérer tous les matchs
router.get('/', matchController.getAllMatches);

// Mettre à jour un match (scores, statut, minute)
router.patch('/matches/:id', verifyCoach, matchController.updateMatch);

module.exports = router;
