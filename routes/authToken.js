const express=require('express');
const jwt=require('jsonwebtoken');

const router=express.Router();

router.get('/',async(req,res)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            await jwt.verify(token,process.env.JWT_SECRET);
            return res.status(200).json({message:'Token Verified'});
        }catch(error)
        {
            res.status(401);
            return res.json({message:'Invalid Token'})
        }
    }
    if(!token) {
        return res.status(401).json({message:"No Token Found"});
    }
})

module.exports=router;