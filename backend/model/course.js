const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Course=new Schema({
    name: String,
    nbrQuiz: Number
     
      
});

module.exports=mongoose.model("Course",Course);