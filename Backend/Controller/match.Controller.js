const Match = require('../Schema/match');


// ==============================
// 🔑 Génération aléatoire de clé
// ==============================
function randomSuffix(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

function generateKey() {
    const numberPart = Math.floor(Math.random() * 100000);
    const suffix = randomSuffix(5);
    return `${numberPart}${suffix}`;
}


// ==========================================
// AJOUTER MATCH
// ==========================================

exports.createMatch = async (req, res) => {

    try {

        const {
            equipeDomicile,
            equipeExterieur,
            typeMatch,
            categorie,
            dateMatch,
            heureMatch,
            stade,
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !equipeDomicile ||
            !equipeExterieur ||
            !typeMatch ||
            !categorie ||
            !dateMatch ||
            !heureMatch ||
            !stade
        ) {

            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis'
            });

        }

        // ==========================================
        // INTERDICTION MEME EQUIPE
        // ==========================================

        if (equipeDomicile === equipeExterieur) {

            return res.status(400).json({
                message: 'Les équipes doivent être différentes'
            });

        }

        // ==========================================
        // CLÉ UNIQUE
        // ==========================================

        const key = generateKey();

        // ==========================================
        // CREATION MATCH
        // ==========================================

        const newMatch = new Match({

            equipeDomicile,
            equipeExterieur,

            typeMatch,
            categorie,

            dateMatch,
            heureMatch,

            stade,

            scoreDomicile: 0,
            scoreExterieur: 0,

            statut: 'Programmé',

            key

        });

        await newMatch.save();

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            message: 'Match créé avec succès',
            match: newMatch

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Erreur serveur'
        });

    }

};


// ==========================================
// RECUPERER TOUS LES MATCHS
// ==========================================

exports.getMatches = async (req, res) => {

    try {

        const matches = await Match.find()
            .sort({ createdAt: -1 });

        res.status(200).json(matches);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Erreur serveur'
        });

    }

};


// ==========================================
// RECUPERER UN MATCH
// ==========================================

exports.getMatchById = async (req, res) => {

    try {

        const match = await Match.findById(req.params.id);

        if (!match) {

            return res.status(404).json({
                message: 'Match introuvable'
            });

        }

        res.status(200).json(match);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Erreur serveur'
        });

    }

};


// ==========================================
// MODIFIER MATCH
// ==========================================

exports.updateMatch = async (req, res) => {

    try {

        // ==========================================
        // SI ON MODIFIE LES EQUIPES
        // ==========================================

        if (
            req.body.equipeDomicile &&
            req.body.equipeExterieur &&
            req.body.equipeDomicile === req.body.equipeExterieur
        ) {

            return res.status(400).json({
                message: 'Les équipes doivent être différentes'
            });

        }

        const updatedMatch = await Match.findByIdAndUpdate(

            req.params.id,

            { ...req.body },

            { new: true }

        );

        if (!updatedMatch) {

            return res.status(404).json({
                message: 'Match introuvable'
            });

        }

        res.status(200).json({

            message: 'Match modifié avec succès',
            match: updatedMatch

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Erreur serveur'
        });

    }

};


// ==========================================
// SUPPRIMER MATCH
// ==========================================

exports.deleteMatch = async (req, res) => {

    try {

        const deletedMatch = await Match.findByIdAndDelete(
            req.params.id
        );

        if (!deletedMatch) {

            return res.status(404).json({
                message: 'Match introuvable'
            });

        }

        res.status(200).json({
            message: 'Match supprimé avec succès'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Erreur serveur'
        });

    }

};