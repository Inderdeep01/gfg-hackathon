const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Signup = require('../models/signup')

router.post('/',(req,res)=>{
    if(req.body.id=='' || req.body.pwd==''){
        res.status(401).json({msg:'Invalid Request!'})
    }
    else{
        const reqid = req.body.id
    Signup.find({id:reqid})
        .then(result=>{
            if(result.length===0){
                res.status(403).json({msg:'Ivalid Credentials!'})
            }
            else{
                console.log(result)
                const reqpwd = req.body.pwd
                const user = result[0]
                bcrypt.compare(reqpwd,user.pwd)
                    .then(result=>{
                        if(result===true){
                            res.status(200).json({msg:'Authenticated',user:user.fname})
                        }
                        else{
                            res.status(403).json({msg:'Invalid Credentials!'})
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
        .catch(err=>{
            try{
                res.status(500).json({info:'Internal Srver Error'})
            }
            catch{}
        })
    }
})

module.exports = router