const express = require('express');
const router = express.Router();

const Classement = require('../models/classement');


router.get('/:categorie', async(req,res)=>{

    try{

        const classement =
        await Classement.find({
            categorie:req.params.categorie
        })
        .sort({
            points:-1,
            butsPour:-1
        });


        res.json(classement);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


module.exports = router;