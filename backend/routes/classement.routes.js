// backend/routes/classement.routes.js
const express = require('express');
const router = express.Router();
const Classement = require('../../src/Schema/classement'); // ton chemin existant
const seedData = require('../../data/classementD4');       // ton chemin existant

// ✅ Route POST pour insérer les classements dans la base
router.post('/seed', async (req, res) => {
  try {
    console.log('🔹 Route /api/classement/seed appelée');

    await Classement.deleteMany({});
    const result = await Classement.insertMany(seedData);

    console.log('✅ Insertion réussie');
    res.json({ message: 'Classements insérés avec succès !', count: result.length });
  } catch (err) {
    console.error('❌ Erreur seed :', err);
    res.status(500).json({ message: 'Erreur lors de l’insertion', error: err.message });
  }
});

// ✅ Route GET pour récupérer tous les classements
router.get('/', async (req, res) => {
  try {
    const classement = await Classement.find();
    res.json(classement);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération classement', error: err.message });
  }
});

// ✅ Alias : si le frontend appelle /api/classements → redirige vers la même logique
router.get('/s', async (req, res) => {
  try {
    const classement = await Classement.find();
    res.json(classement);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération classement (alias)', error: err.message });
  }
});


// ✅ Route PUT pour mettre à jour **toute une catégorie**
router.put('/:categorieId', async (req, res) => {
  try {
    const { categorieId } = req.params;
    const { equipes } = req.body; // tableau d'équipes mis à jour

    if (!Array.isArray(equipes)) return res.status(400).json({ message: 'Equipes manquantes ou invalides' });

    const categorie = await Classement.findById(categorieId);
    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée' });

    // Remplace tout le tableau équipes par les nouvelles données
    categorie.equipes = equipes;
    await categorie.save();

    res.json({ message: 'Catégorie mise à jour avec succès', categorie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur mise à jour catégorie', error: err.message });
  }
});


module.exports = router;
