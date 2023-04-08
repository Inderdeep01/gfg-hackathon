const express = require('express')
const router = express.Router()
const User = require('../models/userModel')

router.delete('/',(req,res)=>{
    const reqid = req.body.id
    User.findOneAndDelete({id:reqid})
        .then(result=>res.sendStatus(204))
        .catch(err=>res.sendStatus(500))
})

module.exports = router