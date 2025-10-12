// controller/confirmation.controller.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const envoyerConfirmation = async (req, res) => {
  try {
    // 🔍 Affiche ce qui arrive pour debug
    console.log("Body reçu :", req.body);

    // Récupération des champs depuis le body
    const { prenom, nom, mailCoach, match, date, lieu, present } = req.body;

    // Vérification des champs obligatoires
    if (!prenom || !nom || !mailCoach || !match || !date || !lieu) {
      return res.status(400).json({ message: "Données manquantes ou invalides" });
    }

    // Création du transporteur nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const statut = present ? "présent ✅" : "absent ❌";

    const emailHtml = `
      <div style="
        font-family: Arial, sans-serif; 
        color: #333; 
        background-color: #f9f9f9; 
        padding: 20px; 
        border-radius: 10px;
      ">
        <!-- Titre -->
        <h2 style="
          color: #004aad; 
          margin-bottom: 10px;
        ">
        Mise à jour de convocation
        </h2>

        <!-- Introduction -->
        <p>Bonjour Coach,</p>

        <!-- Informations sur le joueur et le match -->
        <div style="
          background-color: #fff; 
          padding: 15px; 
          border-radius: 8px; 
          margin-top: 10px; 
          border: 1px solid #ddd;
        ">
          <p>
            Le joueur <strong>${prenom} ${nom}</strong> a indiqué qu'il sera 
            <strong>${statut}</strong> pour le match <strong>${match}</strong> 
            le <strong>${new Date(date).toLocaleDateString('fr-FR')}</strong> 
            à <strong>${new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong> 
            au <strong>${lieu}</strong>.
          </p>

        </div>

        <!-- Séparateur -->
        <hr style="margin: 20px 0; border-color: #ccc;"/>

        <!-- Message de note -->
        <p style="
          font-size: 12px; 
          color: #777;
          margin-top: 10px;
        ">
          Ceci est un message automatique – ne pas répondre.
        </p>
      </div>
    `;


    // Envoi du mail
    await transporter.sendMail({
      from: `"ASDAM - Convocations" <${process.env.EMAIL_USER}>`,
      to: mailCoach,
      subject: `Statut de présence de ${prenom} ${nom} - ${match}`,
      html: emailHtml,
    });

    res.status(200).json({ message: "Mail envoyé au coach ✅" });
  } catch (error) {
    console.error("Erreur d’envoi :", error);
    res.status(500).json({ message: "Erreur lors de l’envoi du mail", error: error.message });
  }
};
