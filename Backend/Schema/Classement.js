const mongoose = require('mongoose');

const classementSchema = new mongoose.Schema({

    equipe: {
        type: String,
        required: true
    },

    categorie: {
        type: String,
        required: true
    },

    matchsJoues: {
        type: Number,
        default: 0
    },

    victoires: {
        type: Number,
        default: 0
    },

    nuls: {
        type: Number,
        default: 0
    },

    defaites: {
        type: Number,
        default: 0
    },

    butsPour: {
        type: Number,
        default: 0
    },

    butsContre: {
        type: Number,
        default: 0
    },

    points: {
        type: Number,
        default: 0
    }

});


module.exports = mongoose.model(
    "Classement",
    classementSchema
);