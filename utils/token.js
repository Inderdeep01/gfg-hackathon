const jwt=require('jsonwebtoken')
const genToken=async(id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
}

module.exports=genToken