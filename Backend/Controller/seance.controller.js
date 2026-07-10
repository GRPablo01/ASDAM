const Seance = require('../Schema/Seance');



// ==========================================
// CREATE
// ==========================================
exports.createSeance = async (req, res) => {

  try {


    const {
      titre,
      description,
      date,
      heure,
      lieu,
      categorie,
      equipe,

      // ✅ Ajout joueurs
      joueursPresent,
      joueursNonPresent

    } = req.body;



    const newSeance = new Seance({

      titre,

      description,

      date,

      heure,

      lieu,

      categorie,


      // ✅ Équipe
      equipe,


      // ✅ Joueurs présents
      joueursPresent: joueursPresent || [],


      // ✅ Joueurs absents
      joueursNonPresent: joueursNonPresent || [],



      createdBy: req.user?.id

    });



    await newSeance.save();



    res.status(201).json({

      success:true,

      message:'Séance créée avec succès',

      seance:newSeance

    });



  } catch(error){


    console.error(
      "Erreur création séance :",
      error
    );



    res.status(500).json({

      success:false,

      message:'Erreur serveur'

    });


  }

};









// ==========================================
// GET ALL
// ==========================================
exports.getSeances = async (req,res)=>{


  try {



    const seances = await Seance.find()


      .populate(
        'createdBy',
        'nom prenom email'
      )


      // ✅ Récupération joueurs
      .populate(
        'joueursPresent',
        'nom prenom email'
      )


      .populate(
        'joueursNonPresent',
        'nom prenom email'
      )


      .sort({
        createdAt:-1
      });



    res.status(200).json(seances);



  } catch(error){



    console.error(
      "Erreur récupération séances :",
      error
    );



    res.status(500).json({

      success:false,

      message:'Erreur récupération séances'

    });



  }


};









// ==========================================
// GET ONE
// ==========================================
exports.getSeanceById = async(req,res)=>{


  try {



    const seance = await Seance.findById(
      req.params.id
    )


    .populate(
      'createdBy',
      'nom prenom email'
    )


    .populate(
      'joueursPresent',
      'nom prenom email'
    )


    .populate(
      'joueursNonPresent',
      'nom prenom email'
    );




    if(!seance){


      return res.status(404).json({

        success:false,

        message:'Séance introuvable'

      });


    }




    res.status(200).json(seance);




  }catch(error){



    console.error(error);



    res.status(500).json({

      success:false,

      message:'Erreur récupération séance'

    });



  }


};









// ==========================================
// UPDATE
// ==========================================
exports.updateSeance = async (req, res) => {

  try {

    console.log("\n================ UPDATE SEANCE ================");
    console.log("ID :", req.params.id);
    console.log("BODY RECU :");
    console.log(JSON.stringify(req.body, null, 2));

    const data = { ...req.body };

    // On ne modifie jamais l'_id
    delete data._id;

    const seance = await Seance.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!seance) {
      return res.status(404).json({
        success: false,
        message: "Séance introuvable"
      });
    }

    console.log("✅ Séance mise à jour :", seance._id);

    res.status(200).json({
      success: true,
      message: "Séance modifiée avec succès",
      seance
    });

  } catch (error) {

    console.error("\n============= ERREUR UPDATE =============");
    console.error(error);
    console.error("Message :", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
      error
    });

  }

};






// ==========================================
// DELETE
// ==========================================
exports.deleteSeance = async(req,res)=>{


  try {



    const seance = await Seance.findByIdAndDelete(

      req.params.id

    );




    if(!seance){


      return res.status(404).json({

        success:false,

        message:'Séance introuvable'

      });


    }





    res.status(200).json({

      success:true,

      message:'Séance supprimée'

    });






  }catch(error){



    console.error(
      "Erreur suppression séance :",
      error
    );



    res.status(500).json({

      success:false,

      message:'Erreur suppression'

    });


  }


};