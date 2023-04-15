const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const gas=require('../middleware/gas')

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
        const tx = new Tx(txObj)
        await tx.save()
    }
    else if(type && type==='forexTransfer'){
        // refer to 'mint' function [forexTransfer]
        txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
        const tx = new Tx(txObj)
        await tx.save()
    }
    else if(type && type==='card'){
        txObj = await cardTransfer(req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
        const tx = new Tx(txObj)
        await tx.save()
        if(req.card.limit<req.body.amount)
            txObj.message = 'Insufficient Card Limit'
        else{

            const pass = await bcrypt
            txObj = await transfer(req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
            txObj.card = req.card
            const tx = new Tx(txObj)
            await tx.save()
        }
    }
    else if(type && type==='cardForex'){}
    else if(type && type==='forexPurchase'){}
    let statusCode = 500
    if(txObj.status)
        statusCode = 200
    return res.status(statusCode).json({txObj})
    
})

module.exports=router;