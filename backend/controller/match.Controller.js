// controller/match.Controller.js
const Match = require('../../src/Schema/Match'); // adapte le chemin selon ta structure
// const Utilisateur = require('../../src/Schema/user'); // si besoin pour les rôles ou permissions

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
      heureFin
    } = req.body;

    // Vérification des champs obligatoires
    if (!equipeA || !equipeB || !date || !lieu || !categorie) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Création du match
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
      duree: 90,
      heureDebut: heureDebut || '', // format "HH:mm"
      heureFin: heureFin || ''      // format "HH:mm"
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
    const matches = await Match.find().sort({ date: -1 }); // tri décroissant par date
    res.status(200).json(matches);
  } catch (err) {
    console.error('Erreur récupération des matchs :', err);
    res.status(500).json({ message: 'Erreur récupération des matchs', error: err });
  }
};

// ------------------- MISE À JOUR D'UN MATCH -------------------
// Route PATCH /matches/:id
exports.updateMatch = async (req, res) => {
  try {
    const { scoreA, scoreB, status, minute, heureDebut, heureFin } = req.body;
    const update = {};

    // Mise à jour conditionnelle : ne pas écraser les champs non fournis
    if (typeof scoreA !== 'undefined') update.scoreA = Number(scoreA);
    if (typeof scoreB !== 'undefined') update.scoreB = Number(scoreB);
    if (typeof status !== 'undefined') update.status = status;
    if (typeof minute !== 'undefined') update.minute = Number(minute);
    if (typeof heureDebut !== 'undefined') update.heureDebut = heureDebut;
    if (typeof heureFin !== 'undefined') update.heureFin = heureFin;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'Aucun champ valide fourni pour mise à jour' });
    }

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true } // renvoie le match mis à jour
    );

    if (!match) return res.status(404).json({ message: 'Match non trouvé' });

    res.status(200).json(match);

  } catch (err) {
    console.error('Erreur mise à jour match :', err);
    res.status(500).json({ message: 'Erreur mise à jour match', error: err });
  }
};
