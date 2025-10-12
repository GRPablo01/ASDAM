const User = require('../../src/Schema/user');

// -------------------- INSCRIPTION --------------------
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeCoach, codeJoueur, equipe, initiale, cguValide } = req.body;

    // Vérif email et mdp obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérif si déjà inscrit
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
    }

    // Création user
    const user = new User({
      nom,
      prenom,
      email,
      password, // ⚠️ à remplacer par hash (bcrypt) en prod
      role,
      codeCoach,
      codeJoueur,
      equipe,
      initiale,
      cguValide
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Erreur registerUser:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- RÉCUPÉRER UN UTILISATEUR --------------------
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- SUPPRIMER UN UTILISATEUR --------------------
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// -------------------- RÉCUPÉRER TOUS LES UTILISATEURS --------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- MODIFIER UN UTILISATEUR --------------------
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }
};

// -------------------- CHANGER LE MOT DE PASSE --------------------
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // ⚠️ à sécuriser avec bcrypt.compare
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    user.password = newPassword; // ⚠️ à sécuriser avec bcrypt.hash
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error("Erreur changePassword:", err);
    res.status(500).json({ message: 'Erreur lors de la modification du mot de passe' });
  }
};

// Récupérer le profil de l’utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    // req.user.id doit venir du middleware auth JWT
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error('Erreur getMe:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère la carte complète de l'utilisateur par ID
exports.getUserCard = async (req, res) => {
  try {
    const userId = req.params.id;

    // Cherche l'utilisateur par ID et exclut password et cguValide
    const user = await User.findById(userId).select('-password -cguValide');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Préparer les données à renvoyer
    const userCard = {
      nom: user.nom,
      prenom: user.prenom,
      equipe: user.equipe,
      role: user.role,
      initiale: user.initiale
    };

    res.json(userCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};