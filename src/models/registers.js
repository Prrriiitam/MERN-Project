const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({
   
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    number: {
        type: Number,
        require: true,
        unique: true
    },
    password : {
        type: String,
        require: true
    },
    repassword : {
        type: String,
        require: true
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }

        }

    ]
    

    
})

employeeSchema.methods.generateAuthToken=async function(){
    try{
        const toooken =jwt.sign( {_id:this._id.toString()} , process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token: toooken}); // we are adding token to schema
        await this.save();
        return toooken;
    }catch(e){
        console.log(`The error while generating jwt token is ${e}`);
    }
}




// employeeSchema.pre("save", async function(next){
//     if(this.isModified("password")){
     
//     this.password= bcrypt.hash(this.password,10);
//     this.repassword= bcrypt.hash(this.password,10);

    
//     }
//     next();
// })

const Register= new mongoose.model("Register", employeeSchema);

module.exports=Register;