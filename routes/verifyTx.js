const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')

const PendingTx = require('../models/pendingTxModel')
const Tx = require('../models/transactionModel')

const hash = require('../utils/hash')
const transfer = require('../utils/transfer')
const forex = require('../utils/forex')
const {sendTxInfoReciever,sendTxInfoSender} = require('../utils/mail')

router.post('/',protect,async (req,res)=>{
    try{
        const {id,otp} = req.body
        const pendingTx = await PendingTx.findById(id)
        if(!pendingTx)
            return res.status(400).json({message:'No such Transaction!'})
        let time = new Date()
        time.setMinutes(time.getMinutes()-10    ) // change this after debugging ############################################
        if(pendingTx && pendingTx.createdAt<time){
            await PendingTx.findByIdAndDelete(id)
            return res.status(400).json({message:'Transaction Timed Out!'})
        }
        const hashed = hash(otp)
        if(hashed!==pendingTx.otp){
            return res.status(400).json({message:"Invalid OTP!"})
        }
        if(hashed===pendingTx.otp){
            //console.log(pendingTx.tx.next)
            const params = pendingTx.tx.params
            const reciept = await eval(pendingTx.tx.next)()
            if(!reciept.status)
                return res.status(400).json({message:reciept.message,reciept})
            const tx = await Tx.create({...pendingTx.tx,...reciept})
            await PendingTx.findByIdAndDelete(id)
            const txObj = await Tx.findById(tx._id).populate([
                {path:'from',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
                {path:'to',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            ])
            await sendTxInfoReciever(txObj)
            await sendTxInfoSender(txObj)
            return res.status(200).json(txObj)
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal Server Error'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports = router