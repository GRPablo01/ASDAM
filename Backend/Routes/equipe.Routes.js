const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const teamController = require('../Controller/equipe.Controller');


// ==========================================
// CRÉATION AUTO DU DOSSIER UPLOAD
// ==========================================

const uploadDir = 'uploads/equipe';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// ==========================================
// MULTER
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }

});

const upload = multer({ storage });


// ==========================================
// ROUTES
// ==========================================

router.post(
    '/create',
    upload.single('logo'),
    teamController.createTeam
);

router.get(
    '/',
    teamController.getTeams
);

module.exports = router;