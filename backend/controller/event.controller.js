import Event from '../../src/Model/Event';

// Récupérer tous les events
export const getEvents = async (_req, res) => {
  try {
    // find() récupère tout, lean() transforme en objet JS simple
    const events = await Event.find().lean();
    
    // optionnel : formater les dates si nécessaire
    // events.forEach(e => e.day = e.day.toISOString().split('T')[0]);

    res.json(events); // renvoie tous les events
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Introuvable' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
