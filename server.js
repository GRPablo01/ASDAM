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

// 👉 IMPORTANT : Docker = mongo / Local = 127.0.0.1
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
// 📁 UPLOADS
// ==============================
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📂 Uploads créé : ${uploadDir}`);
}

app.use('/uploads', express.static(uploadDir));

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
const equipeRoutes = require('./Backend/Routes/equipe.Routes');
const eventRoutes = require('./Backend/Routes/event.Routes');
const actusRoutes = require('./Backend/Routes/actus.Routes');

// ==============================
// 🧭 API ROUTES
// ==============================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matchs', matchRoutes);
app.use('/api/equipes', equipeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/actus', actusRoutes);

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
// 🚀 START SERVER
// ==============================
app.listen(PORT, '0.0.0.0', () => {
  console.log('===================================');
  console.log(`🚀 Serveur démarré`);
  console.log(`🌐 Local : http://localhost:${PORT}`);
  console.log(`📱 Réseau : http://${IP_LOCALE}:${PORT}`);
  console.log('===================================');
});