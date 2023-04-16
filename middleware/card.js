const Card = require('../models/cardModel')

const card =async(req,res,next)=>{
    if(req.body.type==='card' || req.body.type==='cardForex'){
        try{
            const card = await Card.findOne({$and:[{user:req.user._id},{cardNumber:req.body.cardNumber}]})
            if(!card)
                return res.status(400).json({message:'No card Found with matching Number'})
            req.card = card
            next()
        }catch(error)
        {
            res.status(401)
            return res.json({message:'Error : Not authorized - Invalid Card'})
        }
    }
    else{
        next()
    }
}
module.exports=card