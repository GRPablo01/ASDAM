// ==============================
// 📦 Imports
// ==============================
const Communiquer = require('../Schema/communiquer');
const User = require('../Schema/User');
const nodemailer = require('nodemailer');

// ==============================
// 🌍 BASE URL (IMPORTANT)
// ==============================
// 👉 Mets ça dans ton .env en prod : https://asdam.fr
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ==============================
// CONFIG MAIL
// ==============================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// ==============================
// 📢 TEMPLATE EMAIL FULL WIDTH PRO
// ==============================
function generateCommuniqueEmail(titre, message, isDark = false) {

    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const logoUrl = `${BASE_URL}/assets/LOGO.png`;

    const colors = {
        bgPrincipal: isDark ? '#0F0F0F' : '#EEF2F7',
        card: isDark ? '#1A1A1A' : '#FFFFFF',
        soft: isDark ? '#2A0F12' : '#FDECEC',
        text: isDark ? '#F5F5F5' : '#1A1A1A',
        textSoft: isDark ? '#B3B3B3' : '#666',
        primary: '#C1121F',
        border: isDark ? '#333' : '#E5E7EB'
    };

    const formattedDate = new Date().toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Communiqué ASDAM</title>
</head>

<body style="margin:0;padding:0;background:${colors.bgPrincipal};font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:${colors.bgPrincipal};">

<tr>
<td align="center">

<!-- FULL WIDTH WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0">

<tr>
<td align="center" style="padding:40px 10px;">

<!-- CARD FULL WIDTH RESPONSIVE -->
<table width="100%" style="max-width:900px;background:${colors.card};border-radius:16px;overflow:hidden;border:1px solid ${colors.border};">

<!-- HEADER -->
<tr>
<td style="background:${colors.primary};padding:30px;text-align:center;">


    <h1 style="color:white;margin:10px 0;font-size:26px;letter-spacing:1px;display:flex;align-items:center;gap:10px;justify-content:center;">

        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M3 10v4h3l5 5V5L6 10H3z"/>
        </svg>

        COMMUNIQUÉ OFFICIEL
    </h1>

    <p style="color:white;opacity:0.9;font-size:13px;">
        ASDAM • Système de communication interne
    </p>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">

<!-- TITLE -->
<h2 style="color:${colors.primary};margin-bottom:10px;font-size:22px;">
📌 ${titre}
</h2>

<!-- META -->
<p style="color:${colors.textSoft};font-size:13px;margin-bottom:25px;">
🕒 Envoyé le : ${formattedDate}
</p>

<!-- MESSAGE BOX -->
<div style="background:${colors.soft};padding:20px;border-radius:12px;border:1px solid ${colors.border};">

<p style="color:${colors.text};white-space:pre-line;line-height:1.8;font-size:15px;margin:0;">
💬 ${message}
</p>

</div>



</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="text-align:center;padding:25px;background:${isDark ? '#111' : '#F8FAFC'};">

<p style="margin:0;font-weight:bold;">
⚽ ASDAM
</p>

<p style="margin:5px 0;font-size:12px;color:${colors.textSoft};">
🔒 Message automatique - Ne pas répondre
</p>

<p style="font-size:11px;color:${colors.textSoft};opacity:0.7;">
© ${new Date().getFullYear()} ASDAM - Tous droits réservés
</p>

</td>
</tr>

</table>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}
// ==========================
// CREER COMMUNIQUER + ENVOI EMAIL
// ==========================
exports.createCommuniquer = async (req, res) => {

    try {

        const { titre, message } = req.body;
        let { categorie, categories } = req.body;

        // =========================
        // NORMALISATION
        // =========================
        if (categorie && !categories) {
            categories = [categorie];
        }

        if (!categories || categories.length === 0) {
            categories = ['Tous'];
        }

        if (!titre || !message) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // =========================
        // SAVE COMMUNIQUÉ
        // =========================
        const newCommuniquer = new Communiquer({
            titre,
            message,
            categories
        });

        await newCommuniquer.save();

        // =========================
        // USERS
        // =========================
        const allUsers = await User.find({ compte: 'actif' });

        let filteredUsers = allUsers.filter(user => {

            if (categories.includes('Tous')) return true;

            if (user.role === 'invité') {
                return categories.includes('invité');
            }

            if (user.role === 'joueur' || user.role === 'entraineur') {
                return categories.includes(user.equipe);
            }

            if (user.role === 'admin' || user.role === 'superadmin') {
                return true;
            }

            return false;
        });

        // console.log("📢 Communiqué :", titre);
        // console.log("👥 Users :", allUsers.length);
        // console.log("📨 Destinataires :", filteredUsers.length);

        // =========================
        // EMAIL SEND
        // =========================
        for (const user of filteredUsers) {

            if (!user.email) continue;

            try {
                await transporter.sendMail({
                    from: `"ASDAM" <${process.env.MAIL_USER}>`,
                    to: user.email,
                    subject: `📢 ${titre}`,
                    html: generateCommuniqueEmail(titre, message)
                });

                // console.log(`📧 envoyé → ${user.email}`);

            } catch (err) {
                console.error(`❌ erreur mail ${user.email}`, err.message);
            }
        }

        // =========================
        // RESPONSE
        // =========================
        return res.status(201).json({
            message: '✅ Communiqué envoyé avec succès',
            communiquer: newCommuniquer,
            totalUsers: allUsers.length,
            recipients: filteredUsers.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

exports.getCommuniquers = async (req, res) => {
    try {
      const data = await Communiquer.find().sort({ dateCreation: -1 });
  
      return res.status(200).json(data);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  };