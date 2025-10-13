// controller/match.Controller.js
const Match = require('../../src/Schema/Match'); // adapte le chemin selon ta structure
// const Utilisateur = require('../Schema/user'); // si besoin

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

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    console.error('Erreur récupération des matchs:', err);
    res.status(500).json({ message: 'Erreur récupération des matchs', error: err });
  }
};

// Mettre à jour un match (score, status, minute) — route PATCH /:id/score
exports.updateMatch = async (req, res) => {
  try {
    const { scoreA, scoreB, status, minute } = req.body;
    const update = {};

    // Ne pas écraser les valeurs si elles ne sont pas fournies
    if (typeof scoreA !== 'undefined') update.scoreA = Number(scoreA);
    if (typeof scoreB !== 'undefined') update.scoreB = Number(scoreB);
    if (typeof status !== 'undefined') update.status = status;
    if (typeof minute !== 'undefined') update.minute = Number(minute);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide fourni pour mise à jour' });
    }

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    if (!match) return res.status(404).json({ message: 'Match non trouvé' });

    res.status(200).json(match);
  } catch (err) {
    console.error('Erreur mise à jour match:', err);
    res.status(500).json({ message: 'Erreur mise à jour match', error: err });
  }
};
