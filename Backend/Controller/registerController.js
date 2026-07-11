const User = require('../Schema/User');
const bcrypt = require('bcrypt');


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



function generateKey() {

  const numberPart = Math.floor(
    Math.random() * 100000
  );

  const suffix = randomSuffix(5);

  return `${numberPart}${suffix}`;

}





// =========================
// Controller inscription
// =========================

exports.registerUser = async (req, res) => {


try {



let {

nom,
prenom,
email,
password,

role,
poste,
numeroMaillot,
club,

theme,
equipe,
codeAcces,
key,

status,
compte,
compteDesactiveTime,

notification,
cookie,

contact,


// 🔐 Reset password (normalement vide à l'inscription)

resetPasswordKey,
resetPasswordExpire


} = req.body;





// =========================
// VALEURS PAR DÉFAUT
// =========================


poste = poste || undefined;


numeroMaillot = numeroMaillot || undefined;


club = club || '';


theme = ['clair','sombre'].includes(theme)

? theme

: 'clair';




status = [

'En ligne',
'Ne pas deranger',
'Absent'

].includes(status)

? status

: 'En ligne';





compte = [

'actif',
'désactivé',
'supprimé'

].includes(compte)

? compte

: 'actif';




compteDesactiveTime =
compteDesactiveTime || '';




cookie = [

'accepter',
'refuser'

].includes(cookie)

? cookie

: 'refuser';




notification = Array.isArray(notification)

? notification

: [];




contact = Array.isArray(contact)

? contact

: [];




// 🔑 Génération clé utilisateur

key = key || generateKey();




// 🔐 Reset password vide par défaut

resetPasswordKey = null;

resetPasswordExpire = null;






// =========================
// EMAIL EXISTANT
// =========================


const existingUser = await User.findOne({

email

});




if(existingUser){


return res.status(400).json({

message:'Email déjà utilisé'

});


}






// =========================
// RÈGLES MÉTIERS
// =========================



if(role === 'invité'){


equipe = undefined;

codeAcces = undefined;


}






if(role === 'admin'){


equipe = 'ALL';


if(!codeAcces){


return res.status(400).json({

message:
"Code d'accès obligatoire pour admin"

});


}


}






if(role === 'joueur' || role === 'entraineur'){



if(!equipe){


return res.status(400).json({

message:
`L'équipe est obligatoire pour ${role}`

});


}




if(!codeAcces){


return res.status(400).json({

message:
`Code d'accès obligatoire pour ${role}`

});


}


}








// =========================
// ⚽ STATUT SPORTIF
// =========================


let statutSportif = undefined;



if(role === 'joueur'){


statutSportif = 'disponible';


}







// =========================
// 🔒 HASHAGE MOT DE PASSE
// =========================

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);




// =========================
// CRÉATION USER
// =========================


const user = new User({



nom,

prenom,

email,

password: hashedPassword,



role,

poste,

numeroMaillot,

club,



theme,

equipe,

codeAcces,

key,



status,

compte,

compteDesactiveTime,



notification,

cookie,



contact,



// ⚽ Sport

statutSportif,



// 🔐 RESET PASSWORD

resetPasswordKey,

resetPasswordExpire



});





await user.save();






// =========================
// RESPONSE
// =========================


res.status(201).json({


message:
'Utilisateur créé avec succès',


userId:user._id,


key,


compte,


compteDesactiveTime,


cookie,


contact,


statutSportif,



// 🔐 Reset

resetPasswordKey,

resetPasswordExpire


});




}

catch(error){



console.error(
'[REGISTER ERROR]',
error
);




if(error.name === 'ValidationError'){


const messages =
Object.values(error.errors)
.map(e => e.message);



return res.status(400).json({


message:
'Validation échouée',


errors:
messages


});


}





if(error.code === 11000){


return res.status(400).json({


message:
'Email ou key déjà utilisé'


});


}






res.status(500).json({


message:
'Erreur serveur',


error:
error.message


});


}


};