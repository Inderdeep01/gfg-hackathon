const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const gas=require('../middleware/gas')
const Tx = require('../models/transactionModel')
const User = require('../models/userModel')
const mint = require('../utils/mint')
const mongoose = require('mongoose')

router.post('/',protect,gas,async (req,res)=>{
    const user = await User.findOne({accountNo:req.user.accountNo})
    const {token,amount} = req.body
    let txObj = {status:false}
    try {
        minttx = await mint(token,amount,req.user.accountNo)
        txObj.to = user._id
        txObj.from = mongoose.Types.ObjectId(0)
        txObj.amount = req.body.amount
        txObj.currency = req.body.token
        txObj.type = 'Deposit'
        txObj.status = true
        const tx = new Tx(txObj)
        console.log("work");
        let x = await tx.save()
        console.log(x);
        if(!user.currencies.includes(token)){
            user.currencies.push(token)
            await user.save()
        }
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(400)
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;