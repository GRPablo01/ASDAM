const User = require('../Schema/User');
const bcrypt = require('bcrypt');

// ======================================================
// 🔥 GET ALL USERS
// ======================================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// ======================================================
// 🔥 GET USER BY ID
// ======================================================
exports.getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// ======================================================
// 🔥 UPDATE USER
// ======================================================
exports.updateUser = async (req, res) => {
  try {

    const param = req.params.id;

    let user = null;

    // ======================================================
    // 🔥 CAS 1 : Mongo ID
    // ======================================================
    if (param.length === 24) {
      user = await User.findByIdAndUpdate(
        param,
        req.body,
        { new: true }
      );
    }

    // ======================================================
    // 🔥 CAS 2 : KEY custom
    // ======================================================
    if (!user) {
      user = await User.findOneAndUpdate(
        { key: param },
        req.body,
        { new: true }
      );
    }

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user
    });

  } catch (error) {

    console.error("❌ UPDATE ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// ======================================================
// 🗑️ DELETE USER
// ======================================================
exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


// ======================================================
// 🔑 VERIFIER CLE RESET PASSWORD
// ======================================================

exports.verifyResetKey = async (req, res) => {

  try {


    const {
      email,
      resetPasswordKey
    } = req.body;



    console.log("=================================");
    console.log("🔑 VERIFICATION RESET KEY");
    console.log("📧 Email :", email);
    console.log("🔑 Clé reçue :", resetPasswordKey);
    console.log("=================================");




    if (!email || !resetPasswordKey) {

      return res.status(400).json({

        message: "Email et clé obligatoires"

      });

    }




    const user = await User.findOne({

      email: email

    });




    if (!user) {

      console.log("❌ Utilisateur introuvable");

      return res.status(404).json({

        message: "Utilisateur introuvable"

      });

    }





    console.log("👤 User trouvé :", {

      id: user._id,
      email: user.email,
      keyBDD: user.resetPasswordKey,
      expire: user.resetPasswordExpire

    });






    // Vérification expiration

    if (
      !user.resetPasswordExpire ||
      user.resetPasswordExpire < Date.now()
    ) {

      console.log("⌛ Clé expirée");

      return res.status(400).json({

        message: "Clé expirée"

      });

    }






    // Vérification clé

    if (
      user.resetPasswordKey !== resetPasswordKey
    ) {

      console.log("❌ Mauvaise clé");

      return res.status(400).json({

        message: "Clé incorrecte"

      });

    }





    console.log("✅ Clé valide");




    res.json({

      message: "Clé valide"

    });





  } catch (error) {


    console.error(error);


    res.status(500).json({

      message: error.message

    });


  }


};



// ======================================================
// 🔐 RESET PASSWORD AVEC CLE
// ======================================================
exports.resetPassword = async (req, res) => {


  try {


    console.log("=================================");
    console.log("🔐 RESET PASSWORD DEMANDE");
    console.log("=================================");


    console.log("📩 Données reçues :", req.body);




    const {

      email,

      resetPasswordKey,

      password

    } = req.body;





    if (

      !email ||

      !resetPasswordKey ||

      !password

    ) {


      return res.status(400).json({

        success: false,

        message: "Email, clé ou mot de passe manquant"

      });


    }





    const user = await User.findOne({

      email: {

        $regex: new RegExp(`^${email}$`, 'i')

      }

    });





    if (!user) {


      console.log(
        "❌ Utilisateur introuvable :",
        email
      );



      return res.status(404).json({

        success: false,

        message: "Utilisateur introuvable"

      });


    }





    console.log(
      "👤 Utilisateur trouvé :",
      user.email
    );





    console.log(
      "🔑 Clé enregistrée :",
      user.resetPasswordKey
    );


    console.log(
      "🔑 Clé reçue :",
      resetPasswordKey
    );






    if (

      user.resetPasswordKey !== resetPasswordKey

    ) {


      return res.status(400).json({

        success: false,

        message: "Clé incorrecte"

      });


    }






    // ======================================================
    // 🔒 NOUVEAU PASSWORD
    // IMPORTANT :
    // PAS DE bcrypt.hash ICI
    // Le Schema User.js s'en charge
    // ======================================================


    console.log(
      "🔒 Mise à jour du mot de passe..."
    );



    user.password = password;



    // suppression clé

    user.resetPasswordKey = null;

    user.resetPasswordExpire = null;




    await user.save();




    console.log(
      "✅ Nouveau hash enregistré :",
      user.password
    );




    console.log(
      "✅ Mot de passe changé avec succès pour :",
      user.email
    );



    console.log("=================================");





    return res.status(200).json({

      success: true,

      message: "Mot de passe modifié avec succès"

    });





  } catch (error) {


    console.error(
      "❌ ERREUR RESET PASSWORD :",
      error
    );



    return res.status(500).json({

      success: false,

      message: "Erreur serveur",

      error: error.message

    });


  }


};