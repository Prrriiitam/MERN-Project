const jwt =require("jsonwebtoken");
const Register=require("../models/registers");


const auth=async (req,res,next)=>{
    try{
     const cookie = req.cookies.jwt;
    const verifyUser= jwt.verify(cookie, process.env.SECRET_KEY);
    const user=await Register.findOne({_id: verifyUser._id})
    console.log(user.name);
    req.user=user;
    req.cookie=cookie;

    next();
    }
    catch(e){
        res.send(`The error occuring is ${e} , So to avoid this please login first`)
       
       
    }
}
module.exports = auth;