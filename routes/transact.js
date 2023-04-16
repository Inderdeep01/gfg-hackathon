const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const gas=require('../middleware/gas')
const card=require('../middleware/card');
const mongoose = require('mongoose')

const transfer = require('../utils/transfer')
const forex = require('../utils/forex')
//const cardTransfer
//const verifyCard = require('../utils/verifyCard')
const decryptWallet = require('../utils/decryptWallet')
const Tx = require('../models/transactionModel')

/*
transact route:
-> This route is the main transaction route.
*/

router.post('/',protect,card,gas,async (req,res)=>{
    // decrypt the wallet to access the user credentials
    const wallet = await decryptWallet(req.user)
    // check the type of transaction
    const type = req.body.type // [forexTransfer,simpleTransfer,card,cardForex,forexPurchase]
    let txObj = {status:false}
    //check if the settlement curency is same or different
    if(type && type==='simpleTransfer'){
        // refer to 'transfer' function [simpleTransfer]
        txObj = await transfer(req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
        txObj.from = req.user._id
        //txObj.to = req.body.recipient,
        txObj.amount = req.body.amount
        txObj.currency = req.body.destinationToken
        txObj.type = 'simpleTransfer'
        const tx = new Tx(txObj)
        await tx.save()
    }
    else if(type && type==='forexTransfer'){
        // refer to 'mint' function [forexTransfer]
        txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
        txObj.from = req.user._id
        txObj.amount = req.body.amount
        txObj.currency = req.body.destinationToken
        txObj.type = 'forexTransfer'
        const tx = new Tx(txObj)
        await tx.save()
    }
    else if(type && type==='card'){
        if(req.card.limit<req.body.amount)
            txObj.message = 'Insufficient Card Limit'
        else{
            const pass = await bcrypt.compare(req.card.pin,req.body.pin)
            if(!pass)
                return res.status(400).json({message:'Incorrect PIN!'})
            txObj = await transfer(req.body.destinationToken,req.body.amount,wallet,req.body.recipient,req.card._id)
            txObj.from = req.user._id
            txObj.amount = req.body.amount
            txObj.currency = req.body.destinationToken
            txObj.type = 'card'
            const tx = new Tx(txObj)
            await tx.save()
        }
    }
    else if(type && type==='cardForex'){
        if(req.card.limit<req.body.amount)
            txObj.message = 'Insufficient Card Limit'
        else{
            const pass = await bcrypt.compare(req.card.pin,req.body.pin)
            if(!pass)
                return res.status(400).json({message:'Incorrect PIN!'})
            txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
            txObj.from = req.user._id
            txObj.amount = req.body.amount
            txObj.currency = req.body.destinationToken
            txObj.type = 'cardForex'
            const tx = new Tx(txObj)
            await tx.save()
        }
    }
    else if(type && type==='forexPurchase'){
        txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.user.accountNo)
        txObj.from = req.user._id
        txObj.amount = req.body.amount
        txObj.currency = req.body.destinationToken
        txObj.type = 'forexPurchase'
        const tx = new Tx(txObj)
        await tx.save()
    }
    let statusCode = 500
    if(txObj.status)
        statusCode = 200
    return res.status(statusCode).json(txObj)
    
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;