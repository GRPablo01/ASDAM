const User = require('../Schema/User');

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

