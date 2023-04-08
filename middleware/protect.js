const jwt=require('jsonwebtoken');

const protect =async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=await jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded//await User.findById(decoded.id);
            next();
        }catch(error)
        {
            res.status(401);
            return res.json({message:'Error : Not authorized - Invalid Token'})
        }
    }
    if (!token) {
        return res.status(401).json({message:"Not authorized - No Token Found"});
    }
}
module.exports=protect;