const express = require('express');
const router = express.Router();

const userController = require('../Controller/user.controller');

// ======================================================
// 👤 USERS ROUTES
// ======================================================

// ➜ GET all users
router.get('/', userController.getAllUsers);

// ➜ GET user by ID
router.get('/:id', userController.getUserById);

// ➜ UPDATE user
router.put('/:id', userController.updateUser);

// ➜ DELETE user
router.delete('/:id', userController.deleteUser);



module.exports = router;