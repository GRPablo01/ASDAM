const express = require('express');
const router = express.Router();

const matchController = require('../Controller/match.Controller');

// ==========================================
// AJOUTER MATCH
// ==========================================
router.post(
    '/create',
    matchController.createMatch
);

// ==========================================
// RECUPERER TOUS LES MATCHS
// ==========================================
router.get(
    '/',
    matchController.getMatches
);

// ==========================================
// RECUPERER UN MATCH PAR ID
// (utile pour page modifier propre)
// ==========================================
router.get(
    '/:id',
    matchController.getMatchById
);

// ==========================================
// MODIFIER MATCH
// ==========================================
router.put(
    '/:id',
    matchController.updateMatch
);

// ==========================================
// SUPPRIMER MATCH
// ==========================================
router.delete(
    '/:id',
    matchController.deleteMatch
);

module.exports = router;