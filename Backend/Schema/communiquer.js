const mongoose = require('mongoose');

// ==========================================
// SCHÉMA COMMUNIQUER (PROPRE + STABLE)
// ==========================================

const allowedCategories = [
    'Tous',
    'U6','U7','U8','U9','U10','U11',
      'U12','U13','U13F','U18','U23',
      'SeniorA','SeniorB','SeniorD',
];

const communiquerSchema = new mongoose.Schema({

    // ==========================================
    // TITRE
    // ==========================================

    titre: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },

    // ==========================================
    // MESSAGE
    // ==========================================

    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 5000
    },

    // ==========================================
    // MULTI CATÉGORIES (ROBUSTE)
    // ==========================================

    categories: {
        type: [String],

        default: ['Tous'],

        validate: {
            validator: function (values) {

                // sécurité : doit être un tableau
                if (!Array.isArray(values)) return false;

                // chaque valeur doit être autorisée
                return values.every(v => allowedCategories.includes(v));

            },
            message: '❌ Catégorie invalide détectée'
        }
    },

    // ==========================================
    // DATE CRÉATION
    // ==========================================

    dateCreation: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Communiquer', communiquerSchema);