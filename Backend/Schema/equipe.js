const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    categorie: {
        type: String,
        enum: [
            'U6',
            'U7',
            'U8',
            'U9',
            'U10',
            'U11',
            'U12',
            'U13',
            'U13F',
            'U18',
            'U23',
            'SeniorA',
            'SeniorB',
            'SeniorD',
            'ALL'
        ],
        required: true
    },

    anneeCreation: {
        type: Number,
        required: true
    },

    logo: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);