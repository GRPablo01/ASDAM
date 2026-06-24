const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 dossier uploads/actus
const dir = path.join(__dirname, '../uploads/actus');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// ⚙️ storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// 🔒 filtre image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;