const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({

    nom: {
        type: String,
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