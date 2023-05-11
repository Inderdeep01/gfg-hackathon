const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { resetPassMail } = require('../utils/mail')
const User = require('../models/userModel')
const ResetPass = require('../models/resetPassword')
const joi = require('joi')
const crypto = require('crypto')

const passwordSchema = joi.object({
    password:joi.string().min(8).required()
})

router.get('/:email',async (req,res)=>{
    try{
        const {email} = req.params
        const user = await User.findOne({email:email})
        if(!user)
            return res.status(400).json({message:'Invalid User'})
        if(!user.isVerified)
            return res.status(400).json({message:'Email not Verified. Please click on the verification link in your email'})
        const secret = crypto.randomBytes(32).toString('hex')
        const reset = await ResetPass.create({user:user._id,secret:secret})
        const link = `https://interplanetarybank.org/resetPass/${reset._id}/${secret}`
        try{
            await resetPassMail(user.email,link)
        }
        catch{
            return res.status(500).json({message:'Unable to send Email. Try again later.'})
        }
        return res.status(200).json({message:'Link to reset your password has been sent to the verified email.'})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.post('/:id/:secret',async (req,res)=>{
    try{
        const {id,secret} = req.params
        const reset = await ResetPass.findById(id)
        if(!reset || reset.secret!==secret)
            return res.status(400).json({message:'Malformed URL!'})
        let time = new Date()
        time.setMinutes(time.getMinutes()-10)
        if(reset.createdAt<time){
            await ResetPass.findByIdAndDelete(id)
            return res.status(400).json({message:'URL Expired. Please request a new one!'})
        }
        const {password} = req.body
        var {error}=await passwordSchema.validate({password:password})
        if(error){
            error=error.details[0].message.replace( /\"/g, "" )
            return res.status(400).json({message:error})
        }
        const user = await User.findById(reset.user)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        user.password = hashedPassword
        await user.save()
        await ResetPass.findByIdAndDelete(id)
        return res.status(200).json({message:'Password Reset Successful'})
    }
    catch{
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;