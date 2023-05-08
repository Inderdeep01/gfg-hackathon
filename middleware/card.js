const Card = require('../models/cardModel')
const Merchant = require('../models/merchantModel')

const card =async(req,res,next)=>{
    if(req.body.type==='card' || req.body.type==='cardForex'){
        try{
            const card = await Card.findOne({cardNumber:req.body.cardNumber}).populate({
                path:'owner',select:'-cards -currencies -createdAt -updatedAt'
            })
            const merchant = await Merchant.findOne({name:req.body.merchant})
            if(!card)
                return res.status(400).json({message:'No card Found with matching Number'})
            req.card = card
            req.merchant = merchant
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