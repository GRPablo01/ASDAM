const express = require('express');

const router = express.Router();


const {

  createMatch,

  getMatches,

  getMatchById,

  updateMatch,

  deleteMatch


} = require('../Controller/match.controller');




// CREATE

router.post(
  '/create',
  createMatch
);



// GET ALL

router.get(
  '/',
  getMatches
);



// GET ONE ✅

router.get(
  '/:id',
  getMatchById
);



// UPDATE

router.put(
  '/:id',
  updateMatch
);



// DELETE

router.delete(
  '/:id',
  deleteMatch
);



module.exports = router;