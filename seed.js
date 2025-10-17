// seed.js
const mongoose = require('mongoose');
const Categorie = require('./src/Schema/presence'); // chemin vers ton model
const data = require('./data/Joueur'); // chemin vers ton fichier data

// Connecter à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/asdam', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('🔹 Connecté à MongoDB');

  // Optionnel : vider la collection avant de seed
  await Categorie.deleteMany({});

  // Insérer les données
  await Categorie.insertMany(data);
  console.log('✅ Données insérées !');

  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ Erreur :', err);
});
