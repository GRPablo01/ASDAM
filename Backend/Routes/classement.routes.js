const express = require('express');
const router = express.Router();

// ==========================================
// 📦 CONTROLLER
// ==========================================
const classementController = require('../Controller/classement.controller');

// ==========================================
// 🧭 ROUTES
// ==========================================

// GET /api/classement/:categorie → dernier classement
router.get('/:categorie', classementController.getClassement);

// GET /api/classement/:categorie/historique → historique complet
router.get('/:categorie/historique', classementController.getHistorique);

// POST /api/classement/:categorie/generer → forcer la génération
router.post('/:categorie/generer', classementController.genererClassement);

module.exports = router;