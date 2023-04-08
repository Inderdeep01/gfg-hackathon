const express=require('express');
const router=express.Router();
const protect=require('../middleware/protect');
const gas=require('../middleware/gas');

router.post('/',protect,gas,(req,res)=>{
    res.status(200).json(req.user);
})

module.exports=router;