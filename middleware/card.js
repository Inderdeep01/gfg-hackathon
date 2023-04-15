const jwt=require('jsonwebtoken')
const verifyCard = require('../utils/verifyCard')

const card =async(req,res,next)=>{
    if(req.body.token && (req.body.type==='card' || req.body.type==='cardForex')){
        try{
            let token = req.body.token
            const decoded = await verifyCard(token)
            req.card = decoded.card
            next();
        }catch(error)
        {
            res.status(401)
            return res.json({message:'Error : Not authorized - Invalid Token'})
        }
    }
    else if (!req.body.token && (req.body.type==='card' || req.body.type==='cardForex')) {
        return res.status(401).json({message:"Not authorized - No Token Found"})
    }
    else{
        next()
    }
}
module.exports=card