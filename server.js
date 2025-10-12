// ==============================
// 📦 Import des modules
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// ==============================
// 🧩 Import des contrôleurs et routes
// ==============================
const postController = require('./backend/controller/post.controller');

// Routes principales
const userRoutes = require('./backend/routes/User.Routes');
const authRoutes = require('./backend/routes/User.Routes'); // ⚠️ même fichier que userRoutes : vérifie si c’est voulu
const utilisateurRoutes = require('./backend/routes/utilisateur.Routes');
const eventRoutes = require('./backend/routes/Events.Routes');
const matchRoutes = require('./backend/routes/Match.Routes');
const convocationRoutes = require('./backend/routes/convocations.Routes');
const postRoutes = require('./backend/routes/post.Routes');
const joueurRoutes = require('./backend/routes/joueur.routes');
const messageRoutes = require('./backend/routes/message.Routes');
const confirmationRoutes = require('./backend/routes/confirmation.Routes');
const communiqueRoutes = require('./backend/routes/communiquer.Routes');

// ==============================
// ⚙️ Configuration de l'application
// ==============================
const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// 📁 Création du dossier uploads si inexistant
// ==============================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==============================
// 🖼️ Configuration de multer (upload fichiers)
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ==============================
// 🧱 Middlewares globaux
// ==============================
app.use(cors({ origin: '*' })); // ✅ pour test mobile, tu peux restreindre après
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// ==============================
// 🌍 Connexion à MongoDB
// ==============================
mongoose.connect('mongodb://127.0.0.1:27017/asdam')
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// ==============================
// 🧭 Déclaration des routes API
// ==============================
app.use('/api/users', userRoutes);
app.use('/api/asdam', authRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/convocations', convocationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/confirmation', confirmationRoutes);
app.use('/api/communiques', communiqueRoutes);

// ==============================
// 📨 Upload média (posts)
// ==============================
app.post('/api/posts/media', upload.single('media'), postController.createPostWithMedia);

// ==============================
// 🏠 Routes de test
// ==============================
app.get('/', (req, res) => res.send('✅ Serveur ASDAM opérationnel !'));
app.get('/api', (req, res) => res.json({ message: 'Bienvenue sur l’API ASDAM !' }));

// ==============================
// 🚀 Lancement du serveur
// ==============================
const IP_LOCALE = '192.168.1.43'; // 🟢 à remplacer par TON IP locale exacte

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur backend démarré sur http://${IP_LOCALE}:${PORT}`);
  console.log(`📡 Accessible depuis ton téléphone via http://${IP_LOCALE}:${PORT}`);
});
