// backend/routes/confirmation.Routes.js
const express = require('express');
const router = express.Router();

// Import du contrôleur
const { envoyerConfirmation } = require('../controller/confirmation.controller');

// ✅ Route POST pour l'envoi d'un mail de confirmation
router.post('/', envoyerConfirmation);

module.exports = router;
