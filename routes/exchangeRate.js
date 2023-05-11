const express = require('express')
const router = express.Router()
const getConversionRate = require('../utils/getConversionRate')

router.post('/',(req,res)=>{
    try{
        const {sourceToken,destinationToken} = req.body
        const rate = getConversionRate(sourceToken,destinationToken)
        return res.status(200).json({rate:rate})
    }
    catch{
        return res.status(500).json({message:'Server Error',rate:'0'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;