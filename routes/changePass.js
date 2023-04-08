const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Signup = require('../models/userModel')

router.post('/',(req,res)=>{
    const reqid = req.body.id
    const oldPwd = req.body.oldPwd
    const newPwd = req.body.newPwd
    if(oldPwd===newPwd || oldPwd==='' || newPwd===''){
        res.status(401).json({msg:'Invalid Request'})
    }
    else{
        Signup.find({id:reqid})
        .then(result=>{
            if(result.length===0){
                res.status(403).json({msg:'Unauthorised'})
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
                                        .then(result=>res.status(200).json({msg:'Password changed Successfuly!'}))
                                        .catch(err=>res.status(503).json({msg:'Server Down'}))
                                })
                        }
                        else{
                            res.status(401).json({msg:'Unauthorised'})
                        }
                    })
                    .catch(err=>{
                        try{
                            res.status(503).json({msg:'Server Down'})
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

module.exports = router