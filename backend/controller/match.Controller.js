const Match = require('../../src/Schema/Match');

// ------------------- CRÉATION D'UN MATCH -------------------
exports.creerMatch = async (req, res) => {
  try {
    const {
      equipeA,
      equipeB,
      date,
      lieu,
      categorie,
      typeMatch,
      logoA,
      logoB,
      arbitre,
      stade,
      heureDebut,
      heureFin,
      domicile
    } = req.body;

    // Vérification des champs obligatoires
    if (!equipeA || !equipeB || !date || !lieu || !categorie || !heureDebut || !heureFin) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const startDate = new Date(`${date}T${heureDebut}`);
    const endDate = new Date(`${date}T${heureFin}`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Heure ou date invalide' });
    }

    // Vérification des conflits
    const conflit = await Match.findOne({
      date: new Date(date),
      lieu: lieu,
      $or: [
        { $and: [{ heureDebut: { $lte: heureDebut } }, { heureFin: { $gte: heureDebut } }] },
        { $and: [{ heureDebut: { $lte: heureFin } }, { heureFin: { $gte: heureFin } }] },
        { $and: [{ heureDebut: { $gte: heureDebut } }, { heureFin: { $lte: heureFin } }] }
      ]
    });

    if (conflit) {
      return res.status(400).json({ message: 'Un match existe déjà à ce créneau horaire et lieu.' });
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
      status: 'A venir',
      duree: 90,
      heureDebut,
      heureFin,
      domicile: typeof domicile === 'boolean' ? domicile : true
    });

    const savedMatch = await match.save();
    res.status(201).json(savedMatch);

  } catch (err) {
    console.error('Erreur création match :', err);
    res.status(500).json({ message: 'Erreur lors de la création du match', error: err });
  }
};

// ------------------- RÉCUPÉRATION DE TOUS LES MATCHS -------------------
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.status(200).json(matches);
  } catch (err) {
    console.error('Erreur récupération des matchs :', err);
    res.status(500).json({ message: 'Erreur récupération des matchs', error: err });
  }
};

// ------------------- MISE À JOUR D'UN MATCH -------------------
exports.updateMatch = async (req, res) => {
  try {
    const { scoreA, scoreB, status, minute, heureDebut, heureFin, domicile } = req.body;
    const update = {};

    if (typeof scoreA !== 'undefined') update.scoreA = Number(scoreA);
    if (typeof scoreB !== 'undefined') update.scoreB = Number(scoreB);
    if (typeof status !== 'undefined') update.status = status;
    if (typeof minute !== 'undefined') update.minute = Number(minute);
    if (typeof heureDebut !== 'undefined') update.heureDebut = heureDebut;
    if (typeof heureFin !== 'undefined') update.heureFin = heureFin;
    if (typeof domicile !== 'undefined') update.domicile = domicile;

    const match = await Match.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!match) return res.status(404).json({ message: 'Match non trouvé' });
    res.status(200).json(match);

  } catch (err) {
    console.error('Erreur mise à jour match :', err);
    res.status(500).json({ message: 'Erreur mise à jour match', error: err });
  }
};
