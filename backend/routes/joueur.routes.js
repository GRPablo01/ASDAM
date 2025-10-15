const express = require('express');
const { getJoueurs } = require('../controller/joueur.controller'); // le contrôleur pour récupérer les joueurs

const router = express.Router();

// GET /api/joueurs -> récupère tous les joueurs
router.get('/', getJoueurs);

module.exports = router;
