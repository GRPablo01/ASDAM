const express = require('express');
const router = express.Router();
const utilisateurController = require('../controller/utilisateur.controller');

// Récupérer tous les utilisateurs
router.get('/', utilisateurController.getUsers);

// ✅ Récupérer uniquement les joueurs
router.get('/joueurs', utilisateurController.getJoueurs);

// Récupérer l'utilisateur connecté
router.get('/me', utilisateurController.getCurrentUser);

// Récupérer un utilisateur par ID
router.get('/:id', utilisateurController.getUserById);

// Mettre à jour un utilisateur
router.put('/:id', utilisateurController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', utilisateurController.deleteUser);

module.exports = router;