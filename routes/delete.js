const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const protect = require('../middleware/protect')

router.delete('/',protect,(req,res)=>{
    User.findOneAndRemove({_id:req.user._id})
        .then(result=>res.sendStatus(204))
        .catch(err=>res.sendStatus(500))
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router