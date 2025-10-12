require('dotenv').config();
const Convocation = require('../../src/Schema/convocations');
const User = require('../../src/Schema/user');
const nodemailer = require('nodemailer');

// ===== Service Mailer =====
async function sendMail({ to, subject, plainText, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  return transporter.sendMail({
    from: `"TeamAsdam" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: plainText,
    html
  });
}

// ===========================
// Créer une convocation
// ===========================
async function creerConvocation(req, res) {
  try {
    const { match, date, joueurs, lieu, equipe, mailCoach } = req.body;

    // ✅ Validation des champs requis
    if (!match || !date || !joueurs || !Array.isArray(joueurs) || !mailCoach) {
      return res.status(400).json({ message: 'Champs manquants ou invalides (mailCoach obligatoire)' });
    }

    // ✅ Création de la convocation avec mailCoach
    const convocation = new Convocation({ match, date, joueurs, lieu, equipe, mailCoach });
    await convocation.save();

    // URL de confirmation (définie pour éviter l'erreur)
    const confirmationUrl = process.env.NODE_ENV === 'production'
      ? 'https://teamasdam.app/confirmation'
      : 'http://localhost:4200/connexion';

    // Envoyer un email à tous les joueurs
    for (const joueur of joueurs) {
      const user = await User.findById(joueur._id);
      if (user?.email) {
        const subject = `Nouvelle convocation : ${match}`;

        const emailHtml = `
          <div style="
            font-family: Arial, sans-serif; 
            color: #333; 
            background-color: #f9f9f9; 
            padding: 20px; 
            border-radius: 10px;
          ">
            <h2 style="color: #004aad;">Convocation pour le match</h2>

            <p>Bonjour <strong>${user.prenom || ''}</strong>,</p>
            <p>Tu es convoqué pour le prochain match :</p>

            <div style="
              background-color: #fff; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 10px; 
              border: 1px solid #ddd;
            ">
              <p><strong>Match :</strong> ${match}</p>
              <p><strong>Lieu :</strong> ${lieu}</p>
              <p><strong>Date :</strong> ${new Date(date).toLocaleDateString('fr-FR')}</p>
              <p><strong>Heure :</strong> ${new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <p style="margin-top: 20px;">Merci de confirmer votre présence :</p>

            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <a href="${confirmationUrl}" style="
                background-color: #8d0202; 
                color: white; 
                padding: 10px 15px; 
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: bold;
              ">
               Confirme ta présence
              </a>
            </div>

            <p style="margin-top: 30px;">
              Bonne journée,<br/>
              <strong>L'équipe TeamAsdam</strong>
            </p>
          </div>
        `;


        try {
          await sendMail({ to: user.email, subject, plainText: match, html: emailHtml });
          console.log(`✅ Email envoyé à ${user.email}`);
        } catch (err) {
          console.error('❌ Erreur envoi mail', err);
        }
      }
    }

    res.status(201).json(convocation);
  } catch (err) {
    console.error('Erreur création convocation', err);
    res.status(500).json({ message: 'Erreur création convocation', error: err.message });
  }
}

// ===========================
// Récupérer toutes les convocations
// ===========================
async function getAllConvocations(req, res) {
  try {
    const convocations = await Convocation.find()
      .populate('joueurs._id', 'nom prenom equipe role')
      .sort({ date: -1 });
    res.json(convocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des convocations' });
  }
}

// ===========================
// Récupérer une convocation par ID
// ===========================
async function getConvocationById(req, res) {
  try {
    const convocation = await Convocation.findById(req.params.id)
      .populate('joueurs._id', 'nom prenom equipe role');
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json(convocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de la convocation' });
  }
}

// ===========================
// Supprimer une convocation
// ===========================
async function deleteConvocation(req, res) {
  try {
    const convocation = await Convocation.findByIdAndDelete(req.params.id);
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json({ message: 'Convocation supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
}

// ===========================
// Compter les convocations d’un joueur
// ===========================
async function getConvocationCount(req, res) {
  try {
    const { joueurId } = req.params;
    const count = await Convocation.countDocuments({ 'joueurs._id': joueurId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  creerConvocation,
  getAllConvocations,
  getConvocationById,
  deleteConvocation,
  getConvocationCount
};
