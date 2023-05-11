const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const joi = require('joi')

const User = require('../models/userModel')

const userSchema=joi.object({
    oldPwd:joi.string().min(8).required(),
    newPwd:joi.string().min(8).required(),
    id:joi.string().required(),
})

router.post('/',async (req,res)=>{
    const reqid = req.body.id
    const {oldPwd,newPwd} = req.body
    if(oldPwd===newPwd){
        return res.status(401).json({message:'Invalid Request'})
    }
    var {error} = await userSchema.validate({oldPwd,newPwd,reqid});
    if(error){
        error=error.details[0].message.replace( /\"/g, "" );
        return res.status(400).json({message:error});
    }
    
    else{
        User.find({id:reqid})
        .then(result=>{
            if(result.length===0){
                res.status(403).json({message:'Unauthorised'})
            }
            else{
                const user = result[0]
                bcrypt.compare(oldPwd,user.pwd)
                    .then(result=>{
                        if(result===true){
                            bcrypt.hash(newPwd,10)
                                .then(newPwdHash=>{
                                    const updatedUser = {
                                        id:user.id,
                                        fname:user.fname,
                                        lname:user.lname,
                                        pwd:newPwdHash
                                    }
                                    console.log(updatedUser)
                                    User.findOneAndUpdate({_id:user._id},updatedUser)
                                        .then(result=>res.status(200).json({message:'Password changed Successfuly!'}))
                                        .catch(err=>res.status(503).json({message:'Server Down'}))
                                })
                        }
                        else{
                            return res.status(401).json({message:'Unauthorised'})
                        }
                    })
                    .catch(err=>{
                        try{
                            return res.status(503).json({message:'Server Down'})
                        }
                        catch{ return }
                    })
            }
        })
        .catch(err=>{
            try{
                return res.status(500).json({info:'Internal Srver Error'})
            }
            catch{ return }
        })
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router