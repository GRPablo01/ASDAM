const express = require('express');
const router = express.Router();
const communiqueController = require('../controller/communique.controller');

router.get('/', communiqueController.getCommuniques);
router.post('/', communiqueController.uploadImage, communiqueController.addCommunique);
router.post('/like/:id', communiqueController.likeCommunique);
router.post('/dislike/:id', communiqueController.dislikeCommunique);

// 🔹 Passe juste la fonction, pas les parenthèses
router.delete('/:id', communiqueController.supprimerCommunique);

module.exports = router;
