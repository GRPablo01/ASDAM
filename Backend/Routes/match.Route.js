const express = require('express');
const router = express.Router();

const matchController = require('../Controller/match.Controller');


// ==========================================
// AJOUTER
// ==========================================

router.post(
    '/create',
    matchController.createMatch
);


// ==========================================
// RECUPERER
// ==========================================

router.get(
    '/',
    matchController.getMatches
);

module.exports = router;