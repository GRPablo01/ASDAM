const express = require('express');
const router = express.Router();

// ==============================
// CONTROLLER
// ==============================
const communiquerController = require('../Controller/communiquerController');

// ==============================
// DEBUG SAFE (optionnel mais utile)
// ==============================
if (!communiquerController) {
    console.error("❌ Controller non chargé !");
}

if (typeof communiquerController?.createCommuniquer !== 'function') {
    console.error("❌ createCommuniquer n'est pas une fonction");
}

if (typeof communiquerController?.getCommuniquers !== 'function') {
    console.error("❌ getCommuniquers n'est pas une fonction");
}

// ==============================
// ROUTES COMMUNIQUÉ
// ==============================

// ➜ Créer un communiqué
router.post(
    '/',
    (req, res, next) => {
        if (typeof communiquerController.createCommuniquer !== 'function') {
            return res.status(500).json({
                message: "createCommuniquer n'est pas disponible"
            });
        }
        return communiquerController.createCommuniquer(req, res, next);
    }
);

// ➜ Récupérer les communiqués
router.get(
    '/',
    (req, res, next) => {
        if (typeof communiquerController.getCommuniquers !== 'function') {
            return res.status(500).json({
                message: "getCommuniquers n'est pas disponible"
            });
        }
        return communiquerController.getCommuniquers(req, res, next);
    }
);

module.exports = router;