const express = require('express')
const router = express.Router()
const {list} = require('../utils/getConversionRate')

router.get('/',(req,res)=>{
    try{
        return res.status(200).json({rate:list})
    }
    catch{
        return res.status(500).json({message:'Server Error',rate:'0'})
    }
})

router.all('/',(req,res)=>{
    res.status(405).json({message:'This method is not alowed on this route'})
})

module.exports=router;