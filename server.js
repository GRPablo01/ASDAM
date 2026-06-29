// ==============================
// 📦 Imports
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ==============================
// ⚙️ App config
// ==============================
const app = express();

const PORT = process.env.PORT || 3000;
const IP_LOCALE = process.env.IP_LOCALE || '0.0.0.0';

// 👉 MongoDB (Docker / Local)
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://mongo:27017/asdam';

// ==============================
// 🌐 CORS
// ==============================
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user'],
  credentials: true
}));

// ==============================
// 🧱 Middlewares globaux
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📁 UPLOADS (images utilisateurs, pdf, etc.)
// ==============================
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📂 Uploads créé : ${uploadDir}`);
}

app.use('/uploads', express.static(uploadDir, {
  maxAge: '1d'
}));

// ==============================
// 🎨 ASSETS (logos, images statiques)
// ==============================
const assetsDir = path.join(__dirname, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`📂 Assets créé : ${assetsDir}`);
}

console.log('📁 Assets servis depuis :', assetsDir);

app.use('/assets', express.static(assetsDir, {
  extensions: ['png', 'jpg', 'jpeg', 'svg'],
  maxAge: '7d',
  etag: true
}));

// ==============================
// 🌍 MongoDB (SAFE + RECONNECT)
// ==============================
const connectMongo = async () => {
  try {
    console.log('⏳ Connexion MongoDB...');

    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ MongoDB erreur :', err.message);

    console.log('🔁 Nouvelle tentative dans 5 secondes...');
    setTimeout(connectMongo, 5000);
  }
};

connectMongo();

// ==============================
// 🧩 Routes
// ==============================
const authRoutes = require('./Backend/Routes/auth.Routes');
const userRoutes = require('./Backend/Routes/user.routes');
const matchRoutes = require('./Backend/Routes/match.Route');
const equipeRoute = require('./Backend/Routes/equipe.Routes');
const eventRoutes = require('./Backend/Routes/event.Routes');
const actusRoutes = require('./Backend/Routes/actus.Routes');
const convocationRoutes = require('./Backend/Routes/convocation.routes');
const communiquerRoute = require('./Backend/Routes/communiquer.Route');

// ==============================
// 🧭 API ROUTES
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matchs', matchRoutes);
app.use('/api/team', equipeRoute);
app.use('/api/events', eventRoutes);
app.use('/api/actus', actusRoutes);
app.use('/api/convocation', convocationRoutes);
app.use('/api/communiquer', communiquerRoute);

// ==============================
// 🏠 TEST ROUTES
// ==============================
app.get('/', (req, res) => {
  res.send('✅ Serveur ASDAM opérationnel !');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API ASDAM OK',
    status: 'running'
  });
});

// ==============================
// 🔍 DEBUG ROUTE (utile pour ton problème d’image)
// ==============================
app.get('/debug-assets', (req, res) => {
  res.json({
    assetsDir,
    exists: fs.existsSync(assetsDir),
    uploadsDir,
    uploadsExists: fs.existsSync(uploadDir)
  });
});

// ==============================
// 🚀 START SERVER
// ==============================
app.listen(PORT, '0.0.0.0', () => {
  console.log('===================================');
  console.log(`🚀 Serveur démarré`);
  console.log(`🌐 Local : http://localhost:${PORT}`);
  console.log(`📱 Réseau : http://${IP_LOCALE}:${PORT}`);
  console.log('===================================');
});