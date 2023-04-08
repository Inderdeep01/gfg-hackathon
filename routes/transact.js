const express=require('express');
const router=express.Router();
const protect=require('../middleware/protect');
const gas=require('../middleware/gas');
const mint = require('../utils/mint')

router.post('/',protect,gas,async (req,res)=>{
    const tx = await mint(req.body.destinationToken,req.body.amount,req.body.recipient)
    res.status(200).json({user:req.user,tx})
})

module.exports=router;