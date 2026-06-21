const Event = require('../Schema/event');

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const {
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================
    if (
      !titre ||
      !description ||
      !date ||
      !lieu ||
      !heureDebut ||
      !heureFin
    ) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // (optionnel) validation logique des heures
    if (heureDebut >= heureFin) {
      return res.status(400).json({
        message: "L'heure de début doit être inférieure à l'heure de fin",
      });
    }

    const event = new Event({
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
    });

    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// ✏️ UPDATE EVENT
// ======================================================

exports.updateEvent = async (req, res) => {

  try {

    const {
      titre,
      description,
      date,
      lieu,
      heureDebut,
      heureFin,
      image,
      categorie,
      status
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !titre ||
      !description ||
      !date ||
      !lieu ||
      !heureDebut ||
      !heureFin
    ) {

      return res.status(400).json({
        message: 'Champs manquants'
      });
    }

    // =====================================
    // VALIDATION HEURES
    // =====================================

    if (heureDebut >= heureFin) {

      return res.status(400).json({
        message:
          "L'heure de début doit être inférieure à l'heure de fin",
      });
    }

    // =====================================
    // UPDATE DATABASE
    // =====================================

    const updatedEvent =
      await Event.findByIdAndUpdate(

        req.params.id,

        {
          titre,
          description,
          date,
          lieu,
          heureDebut,
          heureFin,
          image,
          categorie,
          status
        },

        {
          new: true
        }
      );

    // =====================================
    // EVENT NOT FOUND
    // =====================================

    if (!updatedEvent) {

      return res.status(404).json({
        message: 'Événement introuvable'
      });
    }

    // =====================================
    // SUCCESS
    // =====================================

    res.status(200).json(updatedEvent);

  } catch (error) {

    console.error(
      '❌ Erreur modification event :',
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};