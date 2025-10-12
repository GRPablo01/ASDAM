require('dotenv').config(); // ⚠️ doit être au début
const Message = require('../../src/Schema/message.js');
const User = require('../../src/Schema/user.js');
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
// Envoyer un message
// ===========================


async function sendMessage(req, res) {
  try {
    const { senderId, receiverId, text, senderName } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // Création du message dans la base
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      senderName,
      read: false,
      timestamp: new Date()
    });

    // Récupérer l'email du destinataire
    const receiver = await User.findById(receiverId);

    if (receiver?.email) {
      console.log('📩 Tentative d’envoi de mail à prout :', receiver.email);

      const subject = `Nouveau message de ${senderName}`;
      const appUrl = process.env.NODE_ENV === 'production'
    ? 'https://teamasdam.app/login'
    : 'http://localhost:4200/connexion';// Lien vers ton app

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Bonjour ${receiver.nom || receiver.lastName || ''},</p>
          <p>Vous avez reçu un nouveau message sur l'application TeamAsdam :</p>
          <p>
            <a href="${appUrl}" target="_blank" 
              style="display: inline-block; 
                      padding: 12px 24px; 
                      background-color: #ca0303; 
                      color: #ffffff !important; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold; 
                      font-size: 14px; 
                      font-family: Arial, sans-serif; 
                      text-align: center;">
              Répondre au message
            </a>

          </p>
          <p>Bonne journée,<br/>L'équipe TeamAsdam</p>
        </div>
      `;

      try {
        await sendMail({ to: receiver.email, subject, plainText: text, html: emailHtml });
        console.log(`✅ Email envoyé à ${receiver.email}`);
      } catch (err) {
        console.error('❌ Erreur envoi mail', err);
      }
    } else {
      console.log('ℹ️ Pas d’email trouvé pour ce destinataire.');
    }

    res.status(200).json(newMessage);

  } catch (err) {
    console.error('Erreur envoi message', err);
    res.status(500).json({ message: 'Erreur envoi message', error: err.message });
  }
}

// ===========================
// Récupérer une conversation entre deux utilisateurs
// ===========================


async function getConversation(req, res) {
  try {
    const { user1Id, user2Id } = req.params;
    const conversation = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ timestamp: 1 });

    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ===========================
// Récupérer tous les messages d’un utilisateur
// ===========================
async function getUserMessages(req, res) {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ===========================
// Récupérer les messages non lus
// ===========================
async function getUnreadMessages(req, res) {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiverId: userId, read: false }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ===========================
// Compter les messages non lus
// ===========================
async function getUnreadCount(req, res) {
  try {
    const { userId } = req.params;
    const count = await Message.countDocuments({ receiverId: userId, read: false });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  sendMessage,
  getConversation,
  getUserMessages,
  getUnreadMessages,
  getUnreadCount
};
