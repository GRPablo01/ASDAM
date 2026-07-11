const User = require('../Schema/User');
const nodemailer = require('nodemailer');


// ==============================
// 📧 CONFIG MAIL
// ==============================

const transporter = nodemailer.createTransport({

  service: 'gmail',

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }

});




// ==============================
// 🔑 Génération aléatoire de clé utilisateur
// ==============================

function randomSuffix(length = 5) {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let result = '';

  for (let i = 0; i < length; i++) {

    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );

  }

  return result;

}



function generateResetKey() {

  const numberPart = Math.floor(
    Math.random() * 100000
  );

  const suffix = randomSuffix(5);

  return `${numberPart}${suffix}`;

}





// ==============================
// ✉️ TEMPLATE EMAIL RESET PASSWORD ASDAM
// ==============================

function generateResetEmailHTML(user, isDark = false){


  const colors = {
  
      // ==========================
      // BACKGROUND
      // ==========================
  
      bgPrincipal: isDark
          ? '#0B1220'
          : '#F8FAFC',
  
  
      bgCard: isDark
          ? '#1E293B'
          : '#FFFFFF',
  
  
      bgFooter: isDark
          ? '#0F172A'
          : '#F1F5F9',
  
  
  
      // ==========================
      // TEXT
      // ==========================
  
      textPrincipal: isDark
          ? '#F8FAFC'
          : '#0F172A',
  
  
      textSecondaire: isDark
          ? '#CBD5E1'
          : '#475569',
  
  
  
      // ==========================
      // ASDAM COLORS
      // ==========================
  
      primary:'#E11D48',
  
      primaryLight:'#FF6B8A',
  
      primaryDark:'#9B1232',
  
  
  
      secondary:'#2563EB',
  
      secondaryLight:'#60A5FA',
  
  
  
      // ==========================
      // SOFT BACKGROUND
      // ==========================
  
      primarySoft:isDark
          ? '#450A0A'
          : '#FFE4E6',
  
  
  
      secondarySoft:isDark
          ? '#1E3A8A'
          : '#DBEAFE',
  
  
  
      border:isDark
          ? '#334155'
          : '#E2E8F0'
  
  
  };
  
  
  
  
  
  return `
  
  
  <!DOCTYPE html>
  
  <html lang="fr">
  
  
  <head>
  
  <meta charset="UTF-8">
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>ASDAM - Reset Password</title>
  
  
  </head>
  
  
  
  <body style="
  margin:0;
  padding:0;
  background:${colors.bgPrincipal};
  font-family:Arial,Helvetica,sans-serif;
  ">
  
  
  
  
  
  <table width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
  padding:40px 20px;
  ">
  
  
  <tr>
  
  <td align="center">
  
  
  
  
  
  <table width="700"
  
  style="
  max-width:700px;
  width:100%;
  background:${colors.bgCard};
  border-radius:20px;
  overflow:hidden;
  border:1px solid ${colors.border};
  box-shadow:0 10px 30px rgba(0,0,0,0.15);
  ">
  
  
  
  
  
  <!-- ==========================
   HEADER
  ========================== -->
  
  
  <tr>
  
  <td style="
  background:linear-gradient(
  135deg,
  ${colors.primary},
  ${colors.secondary}
  );
  padding:35px;
  text-align:center;
  ">
  
  
  <h1 style="
  margin:0;
  color:white;
  font-size:32px;
  letter-spacing:2px;
  ">
  
  ⚽ ASDAM
  
  </h1>
  
  
  
  <p style="
  margin-top:10px;
  color:white;
  font-size:15px;
  opacity:.9;
  ">
  
  Réinitialisation du mot de passe
  
  </p>
  
  
  </td>
  
  </tr>
  
  
  
  
  
  
  
  
  
  <!-- ==========================
   CONTENT
  ========================== -->
  
  
  <tr>
  
  
  <td style="
  padding:35px;
  ">
  
  
  
  
  
  <div style="
  background:${colors.primarySoft};
  border-left:6px solid ${colors.primary};
  padding:25px;
  border-radius:16px;
  text-align:center;
  ">
  
  
  
  
  
  <div style="
  width:85px;
  height:85px;
  line-height:85px;
  margin:auto;
  
  border-radius:50%;
  
  background:${colors.primary};
  
  color:white;
  
  font-size:30px;
  
  font-weight:bold;
  
  text-transform:uppercase;
  
  ">
  
  
  ${(user.prenom?.charAt(0)||'')}${(user.nom?.charAt(0)||'')}
  
  
  </div>
  
  
  
  
  
  
  
  <h2 style="
  margin-top:20px;
  color:${colors.textPrincipal};
  ">
  
  
  Bonjour ${user.prenom || ''} ${user.nom || ''}
  
  
  </h2>
  
  
  
  
  <p style="
  color:${colors.textSecondaire};
  margin:0;
  ">
  
  
  Équipe ASDAM ⚽🔴🔵
  
  
  </p>
  
  
  
  
  </div>
  
  
  
  
  
  
  
  
  
  
  <h3 style="
  margin-top:35px;
  
  color:${colors.primary};
  
  font-size:22px;
  
  ">
  
  
  🔐 Réinitialisation du mot de passe
  
  
  </h3>
  
  
  
  
  
  
  
  <p style="
  color:${colors.textSecondaire};
  
  line-height:1.7;
  
  font-size:15px;
  
  ">
  
  
  Une demande de changement de mot de passe
  a été effectuée pour votre compte ASDAM.
  
  
  </p>
  
  
  
  
  
  
  <p style="
  color:${colors.textSecondaire};
  
  line-height:1.7;
  
  font-size:15px;
  
  ">
  
  
  Utilisez la clé ci-dessous afin de créer
  un nouveau mot de passe.
  
  
  </p>
  
  
  
  
  
  
  
  
  
  
  
  <!-- ==========================
   RESET KEY
  ========================== -->
  
  
  
  <div style="
  margin-top:35px;
  
  padding:25px;
  
  text-align:center;
  
  background:${colors.secondarySoft};
  
  border-radius:16px;
  
  border:2px dashed ${colors.secondary};
  
  ">
  
  
  
  
  
  <p style="
  color:${colors.textSecondaire};
  
  font-size:14px;
  
  ">
  
  
  Votre clé de sécurité :
  
  
  </p>
  
  
  
  
  
  
  
  <div style="
  display:inline-block;
  
  padding:16px 40px;
  
  background:${colors.primary};
  
  color:white;
  
  border-radius:12px;
  
  font-size:26px;
  
  font-weight:bold;
  
  letter-spacing:6px;
  
  ">
  
  
  ${user.resetPasswordKey}
  
  
  </div>
  
  
  
  
  </div>
  
  
  
  
  
  
  
  
  
  
  <p style="
  margin-top:35px;
  
  font-size:13px;
  
  color:${colors.textSecondaire};
  
  ">
  
  
  ⚠️ Cette clé est valable pendant 15 minutes.
  
  
  </p>
  
  
  
  
  
  <p style="
  font-size:13px;
  
  color:${colors.textSecondaire};
  
  ">
  
  
  Si vous n'êtes pas à l'origine de cette demande,
  ignorez simplement cet email.
  
  
  </p>
  
  
  
  
  
  
  </td>
  
  
  </tr>
  
  
  
  
  
  
  
  
  
  <!-- ==========================
   FOOTER
  ========================== -->
  
  
  <tr>
  
  
  <td style="
  padding:25px;
  
  text-align:center;
  
  background:${colors.bgFooter};
  
  border-top:1px solid ${colors.border};
  
  ">
  
  
  
  
  
  <p style="
  margin:0;
  
  font-size:20px;
  
  font-weight:bold;
  
  color:${colors.primary};
  
  ">
  
  
  ASDAM ⚽
  
  
  </p>
  
  
  
  
  
  
  <p style="
  font-size:12px;
  
  color:${colors.textSecondaire};
  
  ">
  
  
  Message automatique - Ne pas répondre
  
  
  </p>
  
  
  
  
  
  
  <p style="
  font-size:11px;
  
  color:${colors.textSecondaire};
  
  ">
  
  
  © ${new Date().getFullYear()} ASDAM Football
  
  
  </p>
  
  
  
  
  
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






// ======================================================
// 🔐 ENVOYER KEY RESET PASSWORD
// ======================================================

exports.sendResetPassword = async(req,res)=>{


    try{
    
    
    const { email } = req.body;
    
    
    
    console.log("=================================");
    console.log("📩 DEMANDE RESET PASSWORD");
    console.log("📧 Email reçu :",email);
    console.log("=================================");
    
    
    
    
    
    if(!email){
    
    return res.status(400).json({
    
    message:"Email obligatoire"
    
    });
    
    }
    
    
    
    
    
    
    
    // ==============================
    // 🔎 USER
    // ==============================
    
    
    console.log("🔎 Recherche utilisateur...");
    
    
    
    const user = await User.findOne({
    
    email:email
    
    });
    
    
    
    
    
    if(!user){
    
    
    console.log("❌ Utilisateur introuvable");
    
    
    return res.status(404).json({
    
    message:"Utilisateur introuvable"
    
    });
    
    }
    
    
    
    console.log("✅ Utilisateur trouvé :",{
    
    id:user._id,
    
    nom:user.nom,
    
    prenom:user.prenom,
    
    email:user.email,
    
    ancienneKey:user.resetPasswordKey || "Aucune"
    
    });
    
    
    
    
    
    
    
    
    
    // ==============================
    // 🔑 GENERATION KEY
    // ==============================
    
    
    const resetKey = generateResetKey();
    
    
    
    console.log(
    "🔑 Nouvelle Key générée :",
    resetKey
    );
    
    
    
    
    
    
    
    // ==============================
    // 💾 SAUVEGARDE KEY
    // ==============================
    
    
    console.log("💾 Mise à jour utilisateur en mémoire...");
    
    
    
    user.resetPasswordKey = resetKey;
    
    
    user.resetPasswordExpire =
    Date.now() + (15 * 60 * 1000);
    
    
    
    
    
    console.log(
    "🔑 Nouvelle clé dans user :",
    user.resetPasswordKey
    );
    
    
    
    
    
    console.log("💾 Sauvegarde MongoDB...");
    
    
    
    await user.save();
    
    
    
    
    
    console.log("✅ Key sauvegardée en base");
    
    
    
    console.log({
    
    id:user._id,
    
    resetPasswordKey:user.resetPasswordKey,
    
    resetPasswordExpire:user.resetPasswordExpire
    
    });
    
    
    
    
    
    
    
    
    
    // ==============================
    // 📧 ENVOI MAIL
    // ==============================
    
    
    console.log(
    "📧 Clé envoyée dans le mail :",
    user.resetPasswordKey
    );
    
    
    
    
    
    const mailOptions = {
    
    
    from:
    
    `"MyAsdam ⚽" <${process.env.MAIL_USER}>`,
    
    
    
    to:user.email,
    
    
    
    subject:
    
    "🔐 Réinitialisation du mot de passe MyAsdam",
    
    
    
    html:
    
    generateResetEmailHTML(
    
    user
    
    )
    
    
    };
    
    
    
    
    
    console.log("📨 Envoi mail...");
    
    
    
    const info = await transporter.sendMail(mailOptions);
    
    
    
    
    
    console.log("=================================");
    console.log("✅ MAIL ENVOYÉ");
    console.log("📧 Destinataire :",user.email);
    console.log("🔑 Clé envoyée :",user.resetPasswordKey);
    console.log("🆔 ID :",info.messageId);
    console.log("=================================");
    
    
    
    
    
    res.json({
    
    message:"Mail de réinitialisation envoyé"
    
    });
    
    
    
    
    
    
    }catch(error){
    
    
    console.error("=================================");
    console.error("❌ ERREUR RESET PASSWORD");
    console.error(error);
    console.error("=================================");
    
    
    
    res.status(500).json({
    
    message:error.message
    
    });
    
    
    }
    
    
};