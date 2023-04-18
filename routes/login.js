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
    try {
        const {email,password}=req.body;
        var {error}=loginSchema.validate({email,password});
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
                token:await genToken(user),
                _id:user._id
            })
        }
        else{
            res.status(401).json({message:'Invalid Credentials'});
        }
    }
    catch{
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router