const express = require('express')
const router = express.Router()
// models
const Tx = require('../models/transactionModel')
// middlewares
const protect = require('../middleware/protect')

router.get('/',protect,async (req,res)=>{
    const page = (req.query.page===NaN || req.query.page < 0 ) ? 1 : req.query.page
    const perPage = 20
    const id = req.user._id.toString()
    const txs = await Tx.find({$or:[{from:req.user._id},{to:req.user._id}]}).sort({createdAt:-1})
        .skip((page-1)*perPage)
        .limit(perPage).populate([
            {path:'from',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'to',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'card',select:'cardNumber expiry cvv network'}
        ])
    return res.status(200).json(txs)
})

router.get('/card',protect,async (req,res)=>{
    const txs = await Tx.find({$and:[{from:req.user._id},{card:req.body._id}]}).sort({createdAt:-1})
        .skip((page-1)*perPage)
        .limit(perPage).populate([
            {path:'from',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'to',select:'-password -wallet -cards -currencies -createdAt -updatedAt'},
            {path:'card',select:'cardNumber expiry cvv network'}
        ])
    return res.status(200).json(txs)
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})
module.exports = router