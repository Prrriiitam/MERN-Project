require("dotenv").config();
const express=require("express");
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const cookieParser = require('cookie-parser');
const auth=require("./middleware/auth");


const app=express();
require("./db/conn");

app.use(cookieParser());

const Register=require("./models/registers");

const port= process.env.PORT || 8000;

const static_path=path.join(__dirname, "../public");
const temp_path=path.join(__dirname, "../templates/views");
const partial_path=path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set("view engine","hbs");
app.set("views",temp_path);
hbs.registerPartials(partial_path);


app.get("/",(req,res)=>{
    res.render("index");
})


app.get("/secret", auth ,(req,res)=>{
    console.log(`this is the cookie stored while login ${req.cookies.jwt}`);
    res.render("secret");
})

app.get("/logout",  auth , async (req,res)=>{
    try{
        console.log(req.user);

        //Here we are filtering all the token if its match then remove them and if that does not match then just store them uniquely in the database
        //and in this method the user will get logout only from the desktop or phone which he is using he would not get logout from all the devices


        req.user.tokens=req.user.tokens.filter((currelem)=>{
            return currelem !=req.token;
        })


        //here we are removing only that cookie from the browser but not from the database


        res.clearCookie("jwt");
        await req.user.save();
        console.log(`Log Out successfully`);
        res.render("login");
    }
    catch(e){
        console.log(`The eror is ${e}`);
    }
})

app.get("/logoutall",  auth , async (req,res)=>{
    try{
        // It will delete all tokens stored in that tokens array
        
        req.user.tokens=[];

        res.clearCookie("jwt");
        await req.user.save();
        console.log(`Log Out successfully`);
        res.render("login");
    }
    catch(e){
        console.log(`The eror is ${e}`);
    }
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

// creating a new user in mongodb


app.post("/register",async (req,res)=>{
   try{
    const password=req.body.password;
    const cpassword=req.body.repassword;

    if(password===cpassword){
        const hashPassword=await bcrypt.hash(password,10);

        const registerEmployee=new Register({
            name:req.body.name,
            email:req.body.email,
            number:req.body.number,
            password:hashPassword,
            repassword: hashPassword

        })
        const token=await registerEmployee.generateAuthToken();
        // console.log(`token generated while registering is ${token}`);


    //The res.cookie("name", value ,[option]) function is used to set the cookie name to value
    //The value parameter may be String or object converted to json


       
    res.cookie('jwt', token, { expires: new Date(Date.now() + 600000),
    httpOnly: true
 });
    console.log(token);


        const registered=await registerEmployee.save();
        res.status(201).render("index");

    }else{
    res.send(`Password does not match`)
    }
   }
   catch(e){
    console.log(`while posting data the error is ${e}`);
   }
})

app.post("/login", async(req,res)=>{
   try{``
    const lemail=req.body.email;
    const lpass=req.body.password;

    const findata=await Register.findOne({email: lemail});
    console.log(findata.password);
    const compare=bcrypt.compare(lpass,findata.password);
    const token=await findata.generateAuthToken();
         
    res.cookie('jwt', token, { expires: new Date(Date.now() + 600000),
        httpOnly: true
     });
    if(compare){
      
        res.render("index");
    }else{
        res.send("login unsuccessfull");
    }

   }catch(e){
    console.log(`The error is ${e}`);
   }
})

// hashing or securing the password


const securePassword=async (password)=>{
    const hashPassword=await bcrypt.hash(password,10);
    console.log(hashPassword);

    //Now comparing the original password with the hashed password

    const compare=await bcrypt.compare("@Pritam142",hashPassword);
    console.log(compare);
    }
    //securePassword("@Pritam142");

 
    //creating a JWT token
//     const jwt=require("jsonwebtoken");
//     const createToken=async ()=>{
//    const token=  jwt.sign( {_id : "6507f12cc3c93028d03558cf"}, "mynameispritamkumarsarangiandguddu", {
//     expiresIn: "2 minutes"
//    });
//    console.log(token);
//    const verify= jwt.verify(token,"mynameispritamkumarsarangiandguddu");
//    console.log(verify);
//     }
//     createToken();



app.listen(port,()=>{
    console.log(`server is running at port ${port} `);
})