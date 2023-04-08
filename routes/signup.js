const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const genToken = require('../utils/token')
const createWallet = require('../utils/createWallet')


const Signup = require('../models/signup')

router.post('/',(req,res)=>{
    if(req.body.id=='' || req.body.pwd==''){
        res.status(401).json({msg:'Invalid Request!'})
    }
    else{
        const reqid = req.body.id
    Signup.find({id:reqid})
        .then(result=>{
            if(result.length === 0){
                bcrypt.hash(req.body.pwd,10).then(result=>{
                    const reqpwd = result
                    const wallet = createWallet(reqpwd)
                    const addr = `0x${wallet[0].address.toUpperCase()}`
                    const newUser = {
                        id: reqid,
                        pwd: reqpwd,
                        fname: req.body.fname? req.body.fname : 'User',
                        lname: req.body.lname,
                        wallet: wallet,
                        primaryAddr: addr
                    }
                    const user = new Signup(newUser)
                    user.save()
                        .then(async ()=>{
                            const token = await genToken(newUser)
                            res.status(201).json({msg:'Signup Successful!',token:token})
                        })
                        .catch(err=>res.status(500).json({msg:'Unexpected Error',error:err}))
                })
            }
            else{
                res.status(403).json({warning:'User already Exists!'})
            }
        })
        .catch(err=>{
            try{
                res.status(500).json({msg:'Internal Server Error'})
            }
            catch{}
        })
    }
})

module.exports = router