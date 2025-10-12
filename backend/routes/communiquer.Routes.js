const express = require('express');
const router = express.Router();
const communiqueController = require('../controller/communique.controller');

// Toutes les routes relatives à /api/communiques
router.get('/', communiqueController.getCommuniques);          // GET /api/communiques
router.post('/', communiqueController.uploadImage, communiqueController.addCommunique); // POST
router.post('/like/:id', communiqueController.likeCommunique);
router.post('/dislike/:id', communiqueController.dislikeCommunique);
router.delete('/:id', async (req, res) => res.status(501).json({ message: "Non implémenté" }));

module.exports = router;
