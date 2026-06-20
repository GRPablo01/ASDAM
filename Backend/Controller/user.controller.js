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

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({
      message: 'Utilisateur modifié avec succès',
      user
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
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