const jwt = require('jsonwebtoken');
const JWT_SECRET = 'May_This_be@/_a214fjgnthrjtknfgrj_secret';
const config=process.env;
const verifyToken=async(req, res, next)=> {
   const token= req.body.token ||  req.query.token || req.header["authorization"] ;

   if(!token){
        return res.status(403).json({
            success:false,
            msg:'A token is required for authentication'
        });
    }
        try{
            const bearer=token.split('');
            const bearerToken=bearer[1];
            const decodedData=jwt.verify(bearerToken,JWT_SECRET); 
            req.user=decodedData;
        }
        catch(error){
            return res.status(403).json({
                success:false,
                msg:'Invalid Token'
            });
        }

        return next();
}

module.exports=verifyToken;