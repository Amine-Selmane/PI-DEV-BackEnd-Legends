const mongoose = require('mongoose');
const Question = require('../model/question');

const Quiz = new mongoose.Schema({
  student: { // Ajoutez une référence à l'utilisateur ici
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assurez-vous que c'est la même valeur que vous utilisez pour le modèle User
  },
  studentGrade: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true // Référence au modèle Course pour le cours
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  date: Date,
  beginTime: String,
  endTime: String
  // questions: {
  //   type: [{
  //     question: {
  //       type: String,
  //       required: true
  //     },
  //     options: {
  //       type: [String],
  //       required: true
  //     },
  //     correctAnswer: {
  //       type: String,
  //       required: true
  //     }
  //   }],
  //   validate: {
  //     validator: function(val) {
  //       return val.length === 5; // Vérifie s'il y a exactement 5 questions
  //     },
  //     message: props => `${props.value.length} questions provided, but exactly 5 questions are required.`
  //   }
  // },
  // mark: {
  //   type: Number,
  //   required: true,
  //   min: 0,
  //   max: 10
  // }
});


module.exports = mongoose.model('Quiz', Quiz);
