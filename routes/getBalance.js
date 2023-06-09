const express = require('express')
const router = express.Router()
const protect=require('../middleware/protect')
const User = require('../models/userModel')
const decryptWallet = require('../utils/decryptWallet')
const getBalance = require('../utils/balance')

router.get('/',protect,async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.currencies.length===0)
            return res.status(200).json({balances:[]})
        let wallet = await decryptWallet(user)
        const balances = await user.currencies.map(async (currency)=>{
            let x = {}
            x['currency']=currency;
            x['balance'] = await getBalance(currency,wallet);
            return x
        })
        let x = await Promise.all(balances)
        delete wallet
        return res.status(200).json(x)
    }
    catch{
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router