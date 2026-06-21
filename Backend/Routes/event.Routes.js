const express = require('express');
const router = express.Router();

const eventController =
  require('../Controller/event.Controller');

// ==============================
// EVENTS ROUTES
// ==============================

router.post(
  '/',
  eventController.createEvent
);

router.get(
  '/',
  eventController.getAllEvents
);

router.put(
  '/:id',
  eventController.updateEvent
);

router.delete(
  '/:id',
  eventController.deleteEvent
);

module.exports = router;