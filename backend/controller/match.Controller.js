const Match = require('../../src/Schema/Match');
const Utilisateur = require('../../src/Schema/user');

exports.creerMatch = async (req, res) => {
  try {
    const { equipeA, equipeB, date, lieu, categorie, typeMatch, logoA, logoB, arbitre, stade } = req.body;

    if (!equipeA || !equipeB || !date || !lieu || !categorie) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const match = new Match({
      equipeA,
      equipeB,
      date: new Date(date),
      lieu,
      categorie,
      typeMatch: typeMatch || 'Championnat',
      logoA: logoA || 'assets/ASDAM.png',
      logoB: logoB || '',
      arbitre: arbitre || '',
      stade: stade || '',
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      duree: 90
    });

    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    console.error('Erreur création match:', err);
    res.status(500).json({ message: 'Erreur lors de la création du match', error: err });
  }
};

// Récupérer tous les matchs
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération des matchs', error: err });
  }
};

// Mettre à jour un match
exports.updateMatch = async (req, res) => {
  try {
    const { scoreA, scoreB, status, minute } = req.body;

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { scoreA, scoreB, status, minute },
      { new: true }
    );

    if (!match) return res.status(404).json({ message: 'Match non trouvé' });

    res.status(200).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Erreur mise à jour match', error: err });
  }
};
