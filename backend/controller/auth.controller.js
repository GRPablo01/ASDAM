// controllers/authController.js
const authService = require('../../services/AuthService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login(email, password);
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur login :', error.message);
    res.status(401).json({ message: error.message });
  }
};

// Middleware pour vérifier le token
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token invalide' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
};

// Récupérer l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  res.json({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    equipe: user.equipe,
    categorie: user.categorie,
  });
};