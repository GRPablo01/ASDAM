const express = require('express');

const router = express.Router();

const {
  createSeance,
  getSeances,
  getSeanceById,
  updateSeance,
  deleteSeance
} = require('../Controller/seance.controller');


// ==========================================
// CREATE
// ==========================================
router.post('/create', createSeance);


// ==========================================
// GET ALL
// ==========================================
router.get('/', getSeances);


// ==========================================
// GET ONE
// ==========================================
router.get('/:id', getSeanceById);


// ==========================================
// UPDATE
// ==========================================
router.put('/:id', updateSeance);


// ==========================================
// DELETE
// ==========================================
router.delete('/:id', deleteSeance);



module.exports = router;