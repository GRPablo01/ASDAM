const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadEquipe');

const teamController =
require('../Controller/equipe.Controller');

router.post(
  '/create',
  upload.single('logo'),
  teamController.createTeam
);

router.get(
  '/',
  teamController.getTeams
);

module.exports = router;