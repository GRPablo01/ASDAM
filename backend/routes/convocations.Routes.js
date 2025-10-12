const express = require('express');
const router = express.Router();
const convocationController = require('../controller/convocations.controller');
const Convocation = require('../../src/Schema/convocations');

// Créer une convocation
router.post('/', convocationController.creerConvocation);

// Récupérer toutes les convocations
router.get('/', convocationController.getAllConvocations);

// Récupérer une convocation par ID
router.get('/:id', convocationController.getConvocationById);

// Supprimer une convocation
router.delete('/:id', convocationController.deleteConvocation);

// Compter les convocations d’un joueur
router.get('/count/:joueurId', convocationController.getConvocationCount);

// ✅ Mettre à jour la présence d’un joueur
router.patch('/:convId/presence', async (req, res) => {
  const { convId } = req.params;
  const { joueurId, present } = req.body;

  if (!joueurId || typeof present !== 'boolean') {
    return res.status(400).json({ message: 'joueurId et present sont requis' });
  }

  try {
    const conv = await Convocation.findById(convId);
    if (!conv) return res.status(404).json({ message: 'Convocation non trouvée' });

    const joueur = conv.joueurs.find(j => j._id.toString() === joueurId);
    if (!joueur) return res.status(404).json({ message: 'Joueur non trouvé dans cette convocation' });

    joueur.etatPresence = present ? 'present' : 'absent';
    await conv.save();

    res.status(200).json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
