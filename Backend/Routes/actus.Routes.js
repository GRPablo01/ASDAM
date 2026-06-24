const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadActus');

const {
  createActus,
  getAllActus,
  getActusById,
  deleteActus,
} = require('../Controller/actusController');

// ==============================
// 🔥 CREATE WITH IMAGE UPLOAD
// ==============================
router.post('/', upload.single('image'), createActus);

router.get('/', getAllActus);
router.get('/:id', getActusById);
router.delete('/:id', deleteActus);

module.exports = router;