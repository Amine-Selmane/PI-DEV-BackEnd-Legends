const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
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

const QuestionModel = mongoose.model("Question", QuestionSchema); // Enregistrez le modèle

module.exports = QuestionModel; // Exportez le modèle, pas le schéma


// const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
// const Question=new Schema({
//     content: {
//         type: String,
//         required: true
//       },
//       options: {
//         type: [String],
//         required: true
//       },
//       correctOptionIndex: {
//         type: Number,
//         required: true
//       }
//     });



// module.exports=mongoose.model("question",Question);