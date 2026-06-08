const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({

    // =========================================
    // EQUIPES
    // =========================================

    equipeDomicile: {
        type: String,
        required: true,
        trim: true
    },

    equipeExterieur: {
        type: String,
        required: true,
        trim: true
    },

    // =========================================
    // TYPE DE MATCH
    // =========================================

    typeMatch: {
        type: String,
        required: true,
        enum: [
            'Championnat',
            'Tournoi',
            'Amical',
            'Coupe'
        ],
        default: 'Amical'
    },

    // =========================================
    // CATEGORIE
    // =========================================

    categorie: {
        type: String,
        trim: true,
        required: true,
        enum: [
            'U6',
            'U7',
            'U8',
            'U9',
            'U10',
            'U11',
            'U12',
            'U13',
            'U14',
            'U15',
            'U16',
            'U17',
            'U18',
            'U23',
            'Senior A',
            'Senior B',
            'Senior D',
        ],
        default: 'Senior A'
    },

    // =========================================
    // DATE & HEURE
    // =========================================

    dateMatch: {
        type: String,
        required: true
    },

    heureMatch: {
        type: String,
        required: true
    },

    // =========================================
    // LIEU
    // =========================================

    stade: {
        type: String,
        required: true,
        trim: true
    },

    // =========================================
    // SCORES
    // =========================================

    scoreDomicile: {
        type: Number,
        default: 0,
        min: 0
    },

    scoreExterieur: {
        type: Number,
        default: 0,
        min: 0
    },

    // =========================================
    // STATUT MATCH
    // =========================================

    statut: {
        type: String,
        enum: [
            'Programmé',
            'En cours',
            'Terminé',
            'Annulé'
        ],
        default: 'Programmé'
    },

    // =========================================
    // CLE UNIQUE
    // =========================================

    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);