const jwt=require('jsonwebtoken')
const genToken=async(user)=>{
    return await jwt.sign({user},process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
}

module.exports=genToken