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
const IP_LOCALE = process.env.IP_LOCALE || '192.168.1.43';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asdam';

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
// 📁 UPLOADS (IMPORTANT CLEAN)
// ==============================
const uploadDir = path.join(__dirname, 'uploads');

// créer dossier si absent
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📂 Uploads créé : ${uploadDir}`);
}

// servir fichiers statiques
app.use('/uploads', express.static(uploadDir));

// ==============================
// 🌍 MongoDB
// ==============================
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });

// ==============================
// 🧩 Routes
// ==============================
const authRoutes = require('./Backend/Routes/auth.Routes');
// const matchRoutes = require('./Backend/Routes/match.Routes');
// const equipeRoutes = require('./Backend/Routes/equipe.Routes');
// const eventRoutes = require('./Backend/Routes/event.Routes');
// const actusRoutes = require('./Backend/Routes/actus.Routes');
// const userRoutes = require('./Backend/Routes/user.Routes');
// const convocationRoutes = require('./Backend/Routes/convocation.routes');
// const messageRoutes = require('./Backend/Routes/message.Routes');
// const contactRoutes = require('./Backend/Routes/contact.Routes');
// const logRoutes = require('./Backend/Routes/log.Routes');

// ==============================
// 🧭 API ROUTES
// ==============================
app.use('/api/auth', authRoutes);
// app.use('/api/matchs', matchRoutes);
// app.use('/api/equipes', equipeRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/actus', actusRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/convocation', convocationRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/logs', logRoutes);

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