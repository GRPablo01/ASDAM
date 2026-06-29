const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 uploads/equipe à la racine du projet
const dir = path.join(process.cwd(), 'uploads', 'equipe');

// Création du dossier si inexistant
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }

});

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Images uniquement'), false);
  }

};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;