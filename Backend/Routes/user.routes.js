const express = require('express');
const router = express.Router();

const userController = require('../Controller/user.controller');

// ======================================================
// 👤 USERS ROUTES
// ======================================================

// ➜ GET all users
router.get('/', userController.getAllUsers);

// ======================================================
// 🔥 GET USER (ID OU KEY)
// ======================================================
router.get('/:id', userController.getUserById);

// ======================================================
// 🔥 UPDATE USER (ID OU KEY)
// ======================================================
router.put('/:id', userController.updateUser);

// ======================================================
// 🗑️ DELETE USER (ID OU KEY)
// ======================================================
router.delete('/:id', userController.deleteUser);

module.exports = router;