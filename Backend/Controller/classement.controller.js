


// ==========================================
// GET CLASSEMENT PAR CATÉGORIE
// ==========================================
exports.getClassement = async (req, res) => {

    try {

        const { categorie } = req.params;


        let classement = await classementService.getDernierClassement(categorie);


        // Si aucun classement n'existe, le générer à la volée
        if (!classement) {
            classement = await classementService.genererClassement(categorie);
        }


        res.status(200).json(classement);


    } catch (error) {


        console.error('❌ Erreur getClassement:', error);


        res.status(500).json({

            message: 'Erreur serveur',

            error: error.message

        });

    }
};




// ==========================================
// GET HISTORIQUE
// ==========================================
exports.getHistorique = async (req, res) => {

    try {

        const { categorie } = req.params;


        const historique = await classementService.getHistoriqueClassement(categorie);


        res.status(200).json(historique);


    } catch (error) {


        console.error('❌ Erreur getHistorique:', error);


        res.status(500).json({

            message: 'Erreur serveur',

            error: error.message

        });

    }
};




// ==========================================
// POST GÉNÉRER CLASSEMENT
// ==========================================
exports.genererClassement = async (req, res) => {

    try {

        const { categorie } = req.params;


        const classement = await classementService.genererClassement(categorie);


        res.status(200).json(classement);


    } catch (error) {


        console.error('❌ Erreur genererClassement:', error);


        res.status(500).json({

            message: 'Erreur serveur',

            error: error.message

        });

    }
};