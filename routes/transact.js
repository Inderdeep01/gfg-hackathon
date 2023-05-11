const express=require('express')
const router=express.Router()
const protect=require('../middleware/protect')
const gas=require('../middleware/gas')
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')


const transfer = require('../utils/transfer')
const forex = require('../utils/forex')
const generateOTP = require('../utils/generateOTP')
const {sendOTPMail} = require('../utils/mail')
//const cardTransfer
//const verifyCard = require('../utils/verifyCard')
const decryptWallet = require('../utils/decryptWallet')
const Tx = require('../models/transactionModel')
const PendingTx = require('../models/pendingTxModel')

/*
transact route:
-> This route is the main transaction route.
*/

router.post('/',protect,gas,async (req,res)=>{
    try{
        // decrypt the wallet to access the user credentials
    const wallet = await decryptWallet(req.user)
    // check the type of transaction
    const type = req.body.type // [forexTransfer,simpleTransfer,forexPurchase]
    let txObj = {status:false}
    let newTx
    //check if the settlement curency is same or different
    if(type && type==='simpleTransfer'){
        // refer to 'transfer' function [simpleTransfer]
        const params = {
            destinationToken: req.body.destinationToken,
            amount: req.body.amount,
            wallet: wallet,
            recipient: req.body.recipient
        }
        txObj.params = params
        const func = async ()=> await transfer(params.destinationToken,params.amount,params.wallet,params.recipient)
        txObj.next = func.toString()
        txObj.from = req.user._id
        //txObj.to = req.body.recipient,
        txObj.amount = req.body.amount
        txObj.currency = req.body.destinationToken
        txObj.settlement = req.body.destinationToken
        txObj.type = 'simpleTransfer'
        const {otp,hashed} = generateOTP()
        try{
            await sendOTPMail(req.user,otp)
        }
        catch(err){
            console.log(err)
            return res.status(400).json({message:'Invalid Email'})
        }
        const tx = await PendingTx.create({user:req.user._id,tx:txObj,otp:hashed})
        return res.status(201).json({id:tx._id,message:'Verify by entering OTP'})
        //newTx = await tx.save()
    }
    else if(type && type==='forexTransfer'){
        // refer to 'mint' function [forexTransfer]
        const params = {
            destinationToken: req.body.destinationToken,
            sourceToken: req.body.sourceToken,
            amount: req.body.amount,
            wallet: wallet,
            recipient: req.body.recipient
        }
        txObj.params = params
        const func = async ()=> await forex(params.sourceToken,params.destinationToken,params.amount,params.wallet,params.recipient)
        txObj.next = func.toString()
        txObj.from = req.user._id
        txObj.amount = req.body.amount
        txObj.currency = req.body.sourceToken
        txObj.settlement = req.body.destinationToken
        txObj.type = 'forexTransfer'
        const {otp,hashed} = generateOTP()
        try{
            await sendOTPMail(req.user,otp)
        }
        catch(err){
            console.log(err)
            return res.status(400).json({message:'Invalid Email'})
        }
        const tx = await PendingTx.create({user:req.user._id,tx:txObj,otp:hashed})
        return res.status(201).json({id:tx._id,message:'Verify by entering OTP'})
    }
    else if(type && type==='forexPurchase'){
        txObj = await forex(req.body.sourceToken,req.body.destinationToken,req.body.amount,wallet,req.user.accountNo)
        txObj.from = req.user._id
        txObj.amount = req.body.amount
        txObj.currency = req.body.sourceToken
        txObj.settlement = req.body.destinationToken
        txObj.type = 'forexPurchase'
        const tx = new Tx(txObj)
        newTx = await tx.save()
    }
    let statusCode = 500
    txObj = await Tx.findById(newTx._id).populate([
        {path:'from',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
        {path:'to',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
        {path:'card',select:'cardNumber expiry cvv network purpose'}
    ])
    if(txObj.status)
        statusCode = 200
    return res.status(statusCode).json(txObj)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal Server Error'})
    }
    
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;