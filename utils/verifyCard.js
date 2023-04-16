const jwt=require('jsonwebtoken');

const verifyCard =async(token)=>{
    //let token;
    if(token){
        try{
            //token=req.headers.authorization.split(" ")[1];
            const decoded=await jwt.verify(token,process.env.JWT_SECRET)
            console.log(decoded)
            return decoded.card//await User.findById(decoded.id);
        }catch(error)
        {
            return false
        }
    }
    if (!token) {
        return false
    }
}
module.exports=verifyCard