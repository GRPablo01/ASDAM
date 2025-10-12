// // src/routes/joueur.routes.js
// import express from 'express';
// import { getJoueurs } from '../controller/utilisateur.controller';

// const router = express.Router();

// // GET /api/joueurs -> récupère tous les joueurs
// router.get('/', getJoueurs);

// export default router;



// src/routes/joueur.routes.js

const express = require('express');
const { getJoueurs } = require('../controller/joueur.controller'); // ✅ CommonJS

const router = express.Router();

// GET tous les joueurs
router.get('/', getJoueurs);

module.exports = router; // ✅ CommonJS


