const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Verification = require('../models/verificationModel')
const {sendVerificationLink, welcome} = require('../utils/mail')

router.get('/:id/:secret',async (req,res)=>{
    try{
        const {id,secret} = req.params
        const user = await User.findById(id)
        const verification = await Verification.findOne({user:id})
        if(!user || !verification)
            return res.status(400).json({message:'Malformed URL!'})
        if(user.isVerified)
            return res.status(200).json({message:'User already Verified'})
        let time = new Date()
        time.setMinutes(time.getMinutes()-10)
        if(verification.createdAt<time){
            await Verification.findByIdAndDelete(verification._id)
            await sendVerificationLink(user)
            return res.status(401).json({message:'URL Expired!'})
        }
        if(user && secret===verification.secret){
            user.isVerified = true
            await user.save()
            await Verification.findByIdAndDelete(verification._id)
            await welcome(user)
            return res.status(200).json({message:'User Verified Successfuly!'})
        }

    }
    catch{
        return res.status(500).json({message:'Internal Server Error!'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router