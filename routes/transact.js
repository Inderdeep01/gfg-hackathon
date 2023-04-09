const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const gas=require('../middleware/gas')
const transfer = require('../utils/transfer')
const forex = require('../utils/forex')
const decryptWallet = require('../utils/decryptWallet')

/*
transact route:
-> This route is the main transaction route.
*/

router.post('/',protect,gas,async (req,res)=>{
    // decrypt the wallet to access the user credentials
    const wallet = await decryptWallet(req.user)
    var tx = {status:false}
    //check if the settlement curency is same or different
    if(req.body.sourceToken===req.body.destinationToken){
        // refer to 'transfer' function
        tx = await transfer(req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
    }
    else{
        // refer to 'mint' function
        tx = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.body.recipient)
    }
    var statusCode = 500
    if(tx.status)
        statusCode = 200
    return res.status(statusCode).json({tx})
    
})

module.exports=router;