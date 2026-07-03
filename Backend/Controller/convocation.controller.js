const mongoose = require('mongoose');
const Convocation = require('../Schema/convocation');
const nodemailer = require('nodemailer');

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
// 🔑 Génération clé
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);

  return `${numberPart}${suffix}`;
}

// ==============================
// ✉️ TEMPLATE EMAIL
// ==============================
function generateEmailHTML(convocation, joueur, isDark = false) {

  const colors = {
    bgPrincipal: isDark ? '#121212' : '#F4F6F8',
    bgCard: isDark ? '#1E1E1E' : '#FFFFFF',
    bgCardSoft: isDark ? '#2A0F12' : '#FDEBEC',

    textPrincipal: isDark ? '#F5F5F5' : '#1A1A1A',
    textSecondaire: isDark ? '#B3B3B3' : '#555555',

    primary: '#C1121F',
    primaryHover: isDark ? '#FF4D4D' : '#E5383B',
    primarySoft: isDark ? '#2A0F12' : '#FDEBEC',

    borderNormal: isDark ? '1px solid #3A3A3A' : '1px solid #E5E7EB'
  };

  const formattedDate = new Date(convocation.dateMatch).toLocaleString('fr-FR', {
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
    <title>Convocation Match - ASDAM</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:${colors.bgPrincipal};
    font-family:Arial,sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">

          <!-- CARD -->
          <table width="700" cellpadding="0" cellspacing="0"
            style="
              max-width:700px;
              width:100%;
              background:${colors.bgCard};
              border-radius:18px;
              overflow:hidden;
              border:${colors.borderNormal};
            ">

            <!-- HEADER -->
            <tr>
              <td style="
                background:${colors.primary};
                padding:30px;
                text-align:center;
              ">

                <h1 style="
                  color:white;
                  margin:0;
                  font-size:30px;
                  letter-spacing:2px;
                ">
                  ⚽ CONVOCATION
                </h1>

                <p style="
                  color:white;
                  margin-top:10px;
                  opacity:0.9;
                ">
                  Match Officiel ASDAM
                </p>

              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:35px;">

                <!-- JOUEUR -->
                <div style="
                  background:${colors.primarySoft};
                  border-left:5px solid ${colors.primary};
                  padding:25px;
                  border-radius:14px;
                  margin-bottom:30px;
                  text-align:center;
                ">

                  <div style="
                    width:80px;
                    height:80px;
                    border-radius:50%;
                    background:${colors.primary};
                    color:white;
                    font-size:28px;
                    font-weight:bold;
                    line-height:80px;
                    margin:auto;
                    text-transform:uppercase;
                  ">
                    ${(joueur.prenom?.charAt(0) || '')}${joueur.nom?.charAt(0) || ''}
                  </div>

                  <p style="
                    margin-top:20px;
                    color:${colors.textSecondaire};
                    text-transform:uppercase;
                    font-size:12px;
                    letter-spacing:1px;
                  ">
                    Joueur convoqué
                  </p>

                  <h2 style="
                    margin:8px 0 0 0;
                    color:${colors.textPrincipal};
                    font-size:28px;
                  ">
                    ${joueur.prenom || ''} ${joueur.nom}
                  </h2>

                </div>

                <!-- INFOS MATCH -->
                <h3 style="
                  color:${colors.primary};
                  margin-bottom:20px;
                  font-size:20px;
                ">
                  📋 Informations du Match
                </h3>

                <table width="100%" cellpadding="12" cellspacing="0">

                  <tr>
                    <td style="color:${colors.textSecondaire}; width:35%;">
                      Compétition
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.TypeCompetition}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Match
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.match}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Équipe domicile
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.equipeDom}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Équipe extérieure
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.equipeExt}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Équipe
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.equipe}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Lieu
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${convocation.lieu}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:${colors.textSecondaire};">
                      Date & Heure
                    </td>

                    <td style="
                      color:${colors.textPrincipal};
                      font-weight:bold;
                    ">
                      ${formattedDate}
                    </td>
                  </tr>

                </table>

                <!-- CONFIRMATION -->
                <div style="
                  margin-top:35px;
                  background:${colors.bgCardSoft};
                  border:${colors.borderNormal};
                  border-radius:16px;
                  padding:30px;
                  text-align:center;
                ">

                  <h3 style="
                    color:${colors.textPrincipal};
                    margin-top:0;
                    font-size:22px;
                  ">
                    ✅ Confirmation de présence
                  </h3>

                  <p style="
                    color:${colors.textSecondaire};
                    line-height:1.7;
                    margin-bottom:30px;
                  ">
                    Merci de confirmer ta présence pour ce match directement depuis le site MyAsdam.
                  </p>

                  <a href="http://192.168.1.43:3000/convocation/${joueur.key}"
                    style="
                      display:inline-block;
                      background:${colors.primary};
                      color:white;
                      text-decoration:none;
                      padding:16px 38px;
                      border-radius:12px;
                      font-weight:bold;
                      font-size:15px;
                      letter-spacing:1px;
                    ">
                    ⚽ ACCÉDER À LA CONVOCATION
                  </a>

                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="
                background:${isDark ? '#1E1E1E' : '#F9FAFB'};
                text-align:center;
                padding:25px;
                border-top:${colors.borderNormal};
              ">

                <p style="
                  margin:0;
                  color:${colors.textPrincipal};
                  font-size:18px;
                  font-weight:bold;
                ">
                  MyAsdam
                </p>

                <p style="
                  margin-top:8px;
                  color:${colors.textSecondaire};
                  font-size:12px;
                ">
                  Message automatique - Ne pas répondre
                </p>

                <p style="
                  margin-top:15px;
                  color:${colors.textSecondaire};
                  font-size:11px;
                  opacity:0.7;
                ">
                  © ${new Date().getFullYear()} MyAsdam. Tous droits réservés.
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

// ============================
// CREATE CONVOCATION
// ============================
exports.createConvocation = async (req, res) => {

  try {

    let {
      joueurs,
      joueursDetails,
      equipe,
      equipeDom,
      equipeExt,
      TypeCompetition,
      match,
      dateMatch,
      lieu
    } = req.body;

    console.log('📩 Données reçues :', req.body);

    // ============================
    // VALIDATION
    // ============================
    if (
      (!joueurs && !joueursDetails) ||
      !equipe ||
      !equipeDom ||
      !equipeExt ||
      !TypeCompetition ||
      !match ||
      !dateMatch ||
      !lieu
    ) {
      return res.status(400).json({
        message: 'Champs obligatoires manquants.'
      });
    }

    // ============================
    // PRIORITÉ joueursDetails
    // ============================
    if (joueursDetails && Array.isArray(joueursDetails)) {

      joueurs = joueursDetails.map(j => {

        if (!j.email) {
          throw new Error(`Email manquant pour ${j.nom}`);
        }

        return {
          nom: j.nom,
          prenom: j.prenom,
          email: j.email,
          present: 'non_repondu',
          key: generateKey()
        };
      });
    }

    // ============================
    // CRÉATION CONVOCATION
    // ============================
    const convocation = new Convocation({
      joueurs,
      equipe,
      equipeDom,
      equipeExt,
      TypeCompetition,
      match,
      dateMatch,
      lieu
    });

    await convocation.save();

    console.log('💾 Convocation créée');

    // ============================
    // ENVOI MAILS
    // ============================
    for (const joueur of joueurs) {

      if (!joueur.email) continue;

      const mailOptions = {
        from: `"MyAsdam ⚽" <${process.env.MAIL_USER}>`,
        to: joueur.email,
        subject: `📣 Convocation - ${match}`,
        html: generateEmailHTML(convocation, joueur)
      };

      try {

        await transporter.sendMail(mailOptions);

        console.log(`📧 Mail envoyé à ${joueur.email}`);

      } catch (err) {

        console.error(
          `❌ Erreur envoi mail à ${joueur.email}`,
          err.message
        );
      }
    }

    res.status(201).json(convocation);

  } catch (error) {

    console.error('❌ Erreur:', error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

// ============================
// GET ALL
// ============================
exports.getAllConvocations = async (req, res) => {

  try {

    const convocations = await Convocation
      .find()
      .sort({ dateMatch: 1 });

    res.json(convocations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ============================
// GET BY ID
// ============================
exports.getConvocationById = async (req, res) => {

  try {

    const convocation = await Convocation.findById(req.params.id);

    if (!convocation) {

      return res.status(404).json({
        message: 'Convocation introuvable'
      });
    }

    res.json(convocation);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ============================
// UPDATE
// ============================
exports.updateConvocationById = async (req, res) => {

  try {

    const updated = await Convocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {

      return res.status(404).json({
        message: 'Convocation introuvable'
      });
    }

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ============================
// DELETE
// ============================
exports.deleteConvocationById = async (req, res) => {

  try {

    const deleted = await Convocation.findByIdAndDelete(req.params.id);

    if (!deleted) {

      return res.status(404).json({
        message: 'Convocation introuvable'
      });
    }

    res.json({
      message: 'Convocation supprimée'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ============================
// UPDATE STATUT JOUEUR
// ============================
exports.updateStatutJoueurByKey = async (req, res) => {

  try {

    const { convocationId, joueurKey } = req.params;
    const { present } = req.body;

    const convocation = await Convocation.findById(convocationId);

    if (!convocation) {

      return res.status(404).json({
        message: 'Convocation introuvable'
      });
    }

    const joueur = convocation.joueurs.find(
      j => j.key === joueurKey
    );

    if (!joueur) {

      return res.status(404).json({
        message: 'Joueur introuvable'
      });
    }

    joueur.present = present;

    await convocation.save();

    res.json({ joueur });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};