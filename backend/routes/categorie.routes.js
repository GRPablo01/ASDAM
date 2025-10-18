const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Categorie = require('../../src/Schema/presence'); // modèle mongoose

// ==========================
// GET toutes les catégories
// ==========================
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur récupération catégories', error: err });
  }
});

// ==========================
// PUT : Mettre à jour le tableau "joueurs" d'une catégorie
// ==========================
router.put('/:id/joueurs', async (req, res) => {
  const { id } = req.params;
  const { joueurs } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID de catégorie invalide' });
  }

  try {
    const categorie = await Categorie.findByIdAndUpdate(
      id,
      { $set: { joueurs } },
      { new: true, runValidators: true }
    );

    if (!categorie) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });

    res.status(200).json({ success: true, message: 'Joueurs mis à jour avec succès', data: categorie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err });
  }
});

// ==========================
// POST : Ajouter un joueur à une catégorie
// ==========================
router.post('/ajouter-joueur', async (req, res) => {
  const { nomEquipe, joueurId, nom, prenom, initiale } = req.body;
  if (!nomEquipe || !joueurId || !nom || !prenom || !initiale) {
    return res.status(400).json({ success: false, message: 'Données manquantes pour ajouter un joueur' });
  }

  try {
    const categorie = await Categorie.findOne({ nomEquipe });
    if (!categorie) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });

    // Utilisation de $addToSet pour éviter les doublons
    const updatedCategorie = await Categorie.findOneAndUpdate(
      { nomEquipe },
      { $addToSet: { joueurs: { joueurId, nom, prenom, initiale } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Joueur ajouté à la catégorie avec succès', data: updatedCategorie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err });
  }
});

// ==========================
// DELETE : Supprimer un joueur d'une catégorie
// ==========================
router.delete('/:id/joueurs/:joueurId', async (req, res) => {
  const { id, joueurId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID de catégorie invalide' });
  }

  try {
    const categorie = await Categorie.findByIdAndUpdate(
      id,
      { $pull: { joueurs: { joueurId } } },
      { new: true }
    );

    if (!categorie) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });

    res.status(200).json({ success: true, message: 'Joueur supprimé avec succès', data: categorie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err });
  }
});

module.exports = router;
