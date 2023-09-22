const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/registration").then(()=>console.log(`connection to mongo db is successful`))
.catch((e)=>console.log(`error during connection to mongodb is ${e}`))