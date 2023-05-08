// this route returns complete details associated with user
/* Currencies-> Balance, Cards, last 20 txns */
const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const User = require('../models/userModel')

router.post('/',protect,async(req,res)=>{
    //const cards = await Card.find({user:req.user._id}) //{$in:[req.user._id]}
    const user = await User.findOne({$or:[{accountNo:req.body.accountNo},{_id:req.body.id}]}).select('firstName lastName accountNo')
    return res.status(200).json(user)
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router