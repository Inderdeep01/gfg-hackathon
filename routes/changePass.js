const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Signup = require('../models/userModel')

router.post('/',(req,res)=>{
    const reqid = req.body.id
    const oldPwd = req.body.oldPwd
    const newPwd = req.body.newPwd
    if(oldPwd===newPwd || oldPwd==='' || newPwd===''){
        res.status(401).json({message:'Invalid Request'})
    }
    else{
        Signup.find({id:reqid})
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
                                    Signup.findOneAndUpdate({_id:user._id},updatedUser)
                                        .then(result=>res.status(200).json({message:'Password changed Successfuly!'}))
                                        .catch(err=>res.status(503).json({message:'Server Down'}))
                                })
                        }
                        else{
                            res.status(401).json({message:'Unauthorised'})
                        }
                    })
                    .catch(err=>{
                        try{
                            res.status(503).json({message:'Server Down'})
                        }
                        catch{}
                    })
            }
        })
        .catch(err=>{
            try{
                res.status(500).json({info:'Internal Srver Error'})
            }
            catch{}
        })
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router