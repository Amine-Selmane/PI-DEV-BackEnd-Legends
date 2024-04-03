const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    role: String,
    grade: { type: String}
});

module.exports=mongoose.model("User",User);