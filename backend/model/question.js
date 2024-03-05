const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Question=new Schema({
    content: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true
      },
      correctOptionIndex: {
        type: Number,
        required: true
      }
    });



module.exports=mongoose.model("question",Question);