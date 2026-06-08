const Team = require('../Schema/equipe');

// ==========================================
// AJOUTER UNE EQUIPE
// ==========================================
exports.createTeam = async (req, res) => {

    try {

        const { nom, saison } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: 'Logo obligatoire'
            });
        }

        if (!nom || !saison) {
            return res.status(400).json({
                message: 'Nom et saison obligatoires'
            });
        }

        const newTeam = new Team({

            nom,
            anneeCreation: Number(saison), // ✅ FIX IMPORTANT
            logo: req.file.filename

        });

        await newTeam.save();

        res.status(201).json({
            message: 'Equipe créée',
            team: newTeam
        });

    } catch (error) {

        console.error("CREATE TEAM ERROR:", error);

        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });

    }
};


// ==========================================
// RECUPERER LES EQUIPES
// ==========================================
exports.getTeams = async (req, res) => {

    try {

        const teams = await Team.find().sort({ createdAt: -1 });

        res.status(200).json(teams);

    } catch (error) {

        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });

    }
};