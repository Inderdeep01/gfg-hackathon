const express = require('express')
const router = express.Router()
const Signup = require('../models/signup')

router.delete('/',(req,res)=>{
    const reqid = req.body.id
    Signup.findOneAndDelete({id:reqid})
        .then(result=>res.sendStatus(204))
        .catch(err=>res.sendStatus(500))
})

module.exports = router