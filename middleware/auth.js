const {validateUserToken}=require('../services/auth');

function authenticateUserCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookie=req.cookies[cookieName];
        if(!tokenCookie){
            return next();
        }
        try{
            const userPayload=validateUserToken(tokenCookie);
            req.user=userPayload;
            return next();
        }catch (error){
            next();
        }
    }
}

module.exports={
    authenticateUserCookie
}