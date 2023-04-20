const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const genToken = require('../utils/token')
const createWallet = require('../utils/createWallet')
const User = require('../models/userModel');
const joi=require('joi');

const userSchema=joi.object({
    firstName:joi.string().min(3).required(),
    lastName:joi.string(),
    email:joi.string().email().required(),
    password:joi.string().min(8).required(),
})

router.post('/',async(req,res)=>{
    try {
        var {firstName,lastName,email,password}=req.body;
        var {error}=await userSchema.validate({firstName,lastName,email,password});
        if(error){
            error=error.details[0].message.replace( /\"/g, "" );
            return res.status(400).json({message:error});
        }
    
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(409).json({message:'User already Exists'});
        }
        const salt=await bcrypt.genSalt(10);
        password=await bcrypt.hash(password,salt);
    
        const wallet=createWallet(password);
        const accountNo=`0x${wallet[0].address.toUpperCase()}`
        const user=await User.create({
            firstName,lastName,email,password,wallet,accountNo
        })
        res.status(201).json({
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            accountNo:user.accountNo,
            _id:user._id,
            token:await genToken(user)
        })
    }
    catch{
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router