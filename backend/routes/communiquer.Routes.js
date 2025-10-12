const express = require('express');
const router = express.Router();
const communiqueController = require('../controller/communique.controller');

// Routes Communiqués
router.get('/commun', communiqueController.getCommuniques);
router.post(
  '/commun',
  communiqueController.uploadImage,
  communiqueController.addCommunique
);
router.post('/commun/like/:id', communiqueController.likeCommunique);
router.post('/commun/dislike/:id', communiqueController.dislikeCommunique);

// Si tu veux pouvoir supprimer un communiqué, ajoute cette fonction dans ton contrôleur
// exports.deleteCommunique = async (...) => { ... }
router.delete('/commun/:id', async (req, res) => {
  res.status(501).json({ message: "Suppression non encore implémentée" });
});

module.exports = router;
