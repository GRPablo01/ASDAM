const express = require('express');
const router = express.Router();

const User = require('../Schema/User');

const {
  registerUser
} = require('../Controller/registerController');

const {
  loginUser,
  updateCookieByKey
} = require('../Controller/loginController');


// ======================================================
// 🔐 AUTH ROUTES
// ======================================================

// REGISTER
router.post('/register', registerUser);

// LOGIN
router.post('/login', loginUser);

// COOKIE UPDATE
router.put('/cookie/:key', updateCookieByKey);


// ======================================================
// 👤 USERS (CRUD KEY-FIRST)
// ======================================================


// 🔥 GET ALL USERS
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error('❌ GET USERS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// 🔥 GET USER BY KEY (PRIMARY)
router.get('/key/:key', async (req, res) => {
  try {
    const user = await User.findOne({ key: req.params.key })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('❌ GET KEY ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// 🔥 UPDATE USER BY KEY (ONLY)
router.put('/key/:key', async (req, res) => {
  try {

    console.log('🔥 UPDATE USER BY KEY');
    console.log('KEY:', req.params.key);
    console.log('BODY:', req.body);

    const updatedUser = await User.findOneAndUpdate(
      { key: req.params.key },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ UPDATE KEY ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// 🔥 DELETE USER BY KEY (PRIMARY CLEAN VERSION)
router.delete('/key/:key', async (req, res) => {

  try {

    console.log('🗑️ DELETE USER BY KEY');
    console.log('KEY:', req.params.key);

    const deletedUser = await User.findOneAndDelete({
      key: req.params.key
    }).select('-password');

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
      user: deletedUser
    });

  } catch (error) {

    console.error('❌ DELETE ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});


// ======================================================
// 📤 EXPORT
// ======================================================
module.exports = router;