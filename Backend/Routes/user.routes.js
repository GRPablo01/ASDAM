const express = require('express');
const router = express.Router();

const userController = require('../Controller/user.controller');
const User = require('../Schema/User');

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



router.get('/email/:email', async (req,res)=>{

    try{

        const user = await User.findOne({
            email:req.params.email
        });


        if(!user){

            return res.status(404).json({
                message:"Utilisateur introuvable"
            });

        }


        res.json(user);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

router.post(
    '/verify-reset-key',
    userController.verifyResetKey
);

// ==========================================
// 🔐 RESET PASSWORD
// ==========================================
router.patch(
    '/reset-password',
    userController.resetPassword
);

module.exports = router;