const express = require('express');
const router = express.Router();
const Categorie = require('../../src/Schema/presence'); // modèle mongoose

// GET toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération catégories', error: err });
  }
});

// PUT : mettre à jour le tableau "joueur" d'une catégorie
router.put('/:id/joueurs', async (req, res) => {
  try {
    const { joueurs } = req.body; // tableau envoyé depuis Angular

    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      { $set: { joueur: joueurs } }, // <-- le nom du champ exact dans le schema
      { new: true }
    );

    if (!categorie) return res.status(404).json({ message: 'Catégorie non trouvée' });

    res.json({ message: 'Joueurs mis à jour avec succès', categorie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});


module.exports = router;
