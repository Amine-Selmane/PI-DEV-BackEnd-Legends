const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=new Schema({
    firstName: String,
    lastName: String,
    role: String 
});

module.exports=mongoose.model("User",User);