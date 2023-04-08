const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const joi=require('joi');
const genToken = require('../utils/token');

const loginSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required().min(8)
})

router.post('/',async(req,res)=>{
        const {email,password}=req.body;
        const {error}=loginSchema.validate({email,password});
        if(error){
            error=error.details[0].message.replace( /\"/g, "" );
            return res.status(400).json({message:error});
        }
        const user=await User.findOne({email});

        //if user exist and password matches
        if(user && await bcrypt.compare(password,user.password)){
            res.status(200).json({
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                accountNo:user.accountNo,
                token:await genToken(user)
            })
        }
        else{
            res.status(401).json({message:'Invalid Credentials'});
        }
})

module.exports = router