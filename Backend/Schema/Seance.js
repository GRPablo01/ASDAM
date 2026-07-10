const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema(
  {

    // ==========================================
    // INFORMATIONS DE LA SEANCE
    // ==========================================

    titre: {
      type: String,
      required: true,
      trim: true
    },


    description: {
      type: String,
      required: true,
      trim: true
    },


    date: {
      type: Date,
      required: true
    },


    heure: {
      type: String,
      required: true,
      trim: true
    },


    lieu: {
      type: String,
      required: true,
      trim: true
    },


    categorie: {
      type: String,
      default: 'Entraînement',
      trim: true
    },



    // ==========================================
    // EQUIPE CONCERNEE
    // ==========================================

    equipe: {

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



    // ==========================================
// JOUEURS PRESENTS
// ==========================================

joueursPresent: {

  type: [
    {
      type: String,
      trim: true
    }
  ],

  default: []

},



// ==========================================
// JOUEURS ABSENTS
// ==========================================

joueursNonPresent: {

  type: [
    {
      type: String,
      trim: true
    }
  ],

  default: []

},



    // ==========================================
    // CREATEUR DE LA SEANCE
    // ==========================================

    createdBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref: 'User',

      required: false

    }

  },


  {
    timestamps: true
  }

);



// ==========================================
// EVITE LES VALEURS NULL DANS LES TABLEAUX
// ==========================================

seanceSchema.pre('save', function(next){

  if(!this.joueursPresent){
    this.joueursPresent = [];
  }


  if(!this.joueursNonPresent){
    this.joueursNonPresent = [];
  }


  next();

});



// ==========================================
// EXPORT
// ==========================================

module.exports = mongoose.model(
  'Seance',
  seanceSchema
);