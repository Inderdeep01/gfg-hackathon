const jwt=require('jsonwebtoken')
const genCardToken=async(card)=>{
    return await jwt.sign({card},process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
}

module.exports=genCardToken