const express = require('express')
const router = express.Router()
const card=require('../middleware/card')

const transfer = require('../utils/transfer')
const forex = require('../utils/forex')
const decryptWallet = require('../utils/decryptWallet')
const Tx = require('../models/transactionModel')

/*
merchant route:
-> This route is open for Merchants and Acquirers to process card transactions.
*/

router.post('/',card, async (req,res)=>{
    try{
        const wallet = await decryptWallet(req.card.owner)
        const type = req.body.type // [card,cardForex]
        let txObj = {status:false}
        let newTx
        if(type && type==='card'){
            if(req.card.isBlocked)
                txObj.message = 'This card is Blocked!'
            else if(req.card.limit<req.body.amount)
                txObj.message = 'Insufficient Card Limit'
            else if(req.body.cvv!==req.card.cvv || req.body.expiry!==req.card.expiryDate)
                return res.status(400).json({message:'Invalid card credentials!'})
            else{
                const pass = await bcrypt.compare(req.body.pin,req.card.pin)
                if(!pass)
                    return res.status(400).json({message:'Incorrect PIN!'})
                txObj = await transfer(req.body.destinationToken,req.body.amount,wallet,req.merchant.accountNo,req.card._id)
                txObj.from = req.card.owner._id
                txObj.amount = req.body.amount
                txObj.currency = req.body.destinationToken
                txObj.type = 'card'
                const tx = new Tx(txObj)
                newTx = await tx.save()
            }
        }
        else if(type && type==='cardForex'){
            if(req.card.isBlocked)
                txObj.message = 'This card is Blocked!'
            else if(req.card.limit<req.body.amount)
                txObj.message = 'Insufficient Card Limit'
            else{
                const pass = await bcrypt.compare(req.body.pin,req.card.pin)
                if(!pass)
                    return res.status(400).json({message:'Incorrect PIN!'})
                txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.merchant.accountNo,req.card._id)
                txObj.from = req.card.owner._id
                txObj.amount = req.body.amount
                txObj.currency = req.body.sourceToken
                txObj.type = 'cardForex'
                const tx = new Tx(txObj)
                newTx = await tx.save()
            }
        }
        let statusCode = 500
        txObj = await Tx.findById(newTx._id).populate([
            {path:'from',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'to',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'card',select:'cardNumber expiry network purpose'}
        ])
        if(txObj.status)
            statusCode = 200
        return res.status(statusCode).json(txObj)
    }
    catch(err){
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router