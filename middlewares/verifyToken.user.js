const jwt = require("jsonwebtoken")
require("dotenv").config()

const verifyToken = (request,response,next)=>{ //Middleware to verify the token or get the token
    try{
    // const token = request.cookies.token;
    console.log("Cookies:", request.cookies);
    console.log("Authorization header:", request.headers['authorization']);
    const token = request.cookies.token || request.headers['authorization']?.split(' ')[1]; 
    if(!token){
        return response.status(403).json({
            message:`No token Provided!`
        })
    }
    console.log(token, "token seted!")


    console.log("secret key ", process.env.JWT_SECRET)
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        request.user = decoded
        next();
    }catch(error){
        response.status(401).json({
            message:`Invalid or expired Token!`
        })
    }

}

module.exports = verifyToken