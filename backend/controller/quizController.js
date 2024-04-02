const Quiz = require('../model/quiz');
const Course = require('../model/course');
const User = require('../model/user');
const Question = require('../model/question');




// POST - Créer un nouveau quiz
async function createQuiz(req, res) {
  try {
    const { studentId, courseId, date, beginTime, endTime, questionIds } = req.body;
    console.log('Received data:', req.body); // Vérifiez les données reçues du frontend
    const student = await User.findById(studentId);
    console.log('Student:', student); // Vérifiez si l'étudiant a été trouvé
    const course = await Course.findById(courseId);
    console.log('Course:', course); // Vérifiez si le cours a été trouvé
    const questions = await Question.find({ _id: { $in: questionIds } });
    console.log('Questions:', questions); // Vérifiez si les questions ont été trouvées
    if (!student || !course || questions.length !== questionIds.length || questions.length < 5) {
      return res.status(400).json({ message: 'Student, course, or question(s) not found, or less than 5 questions provided' });
    }
    const quiz = new Quiz({
      student: student._id,
      course: course._id,
      questions: questions.map(question => question._id),
      date,
      beginTime,
      endTime
    });
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: error.message });
  }
}



// GET - Récupérer tous les quiz
async function getAllQuizzes (req, res) {
  try {
    const quizzes = await Quiz.find().populate('student', 'firstName lastName').populate('course', 'name').populate('questions', 'content');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - Récupérer un quiz par son ID
async function getQuizById(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('student', 'firstName lastName')
      .populate('course', 'name')
      .populate('questions', 'content');
    console.log('Quiz data:', quiz); // Ajoutez ce journal pour vérifier les données du quiz
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ quiz }); // Inclure le contenu des questions dans la réponse
  } catch (error) {
    console.log('Error fetching quiz:', error); // Ajoutez ce journal pour vérifier les erreurs
    res.status(500).json({ message: error.message });
  }
}


// PUT - Mettre à jour un quiz
async function updateQuiz(req, res) {
  try {
    const quizId = req.params.id;
    const { date, beginTime, endTime, questionIds } = req.body;

    let quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Récupérer les questions complètes à partir de leurs IDs, y compris leur contenu
    const questions = await Question.find({ _id: { $in: questionIds } }).populate('content');

    // Mise à jour des champs du quiz avec les données de req.body
    quiz.date = date;
    quiz.beginTime = beginTime;
    quiz.endTime = endTime;

    // Remplacer les IDs des questions par les objets complets
    quiz.questions = questions;

    // Enregistrer les modifications apportées au quiz
    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ error: "Error updating quiz" });
  }
};
// Méthode pour récupérer toutes les questions
async function getAllQuestions(req, res) {
  try {
    const questions = await Question.find();
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: "Error fetching questions" });
  }
}



  // try {
  //   const { studentId, courseId, date, beginTime, endTime } = req.body;
  //   const quiz = await Quiz.findById(req.params.id);
  //   if (!quiz) {
  //     return res.status(404).json({ message: 'Quiz not found' });
  //   }
  //   const student = await User.findById(studentId);
  //   const course = await Course.findById(courseId);
  //   if (!student || !course) {
  //     return res.status(404).json({ message: 'Student or course not found' });
  //   }
  //   quiz.student = student._id;
  //   quiz.course = course._id;
  //   quiz.date = date;
  //   quiz.beginTime = beginTime;
  //   quiz.endTime = endTime;
  //   const updatedQuiz = await quiz.save();
  //   res.json(updatedQuiz);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }


// DELETE - Supprimer un quiz

async function deleteQuiz (req, res) {
  try {
      const quizId = req.params.id;
      // Vérifiez d'abord si le rapport existe
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
      }
      // Si le rapport existe, supprimez-le de la base de données
      await Quiz.findByIdAndDelete(quizId);
      res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: 'Error deleting quiz' });
  }
}
module.exports={createQuiz,getAllQuizzes,getQuizById,updateQuiz,deleteQuiz,getAllQuestions};
// async function deleteQuiz (req, res){
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }
//     await quiz.remove();
//     res.json({ message: 'Quiz deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Créer un quiz
// async function createQuiz (req, res) {
 
//     try {
//       const { studentName, courseName, questions } = req.body;
      
//       // Vérifier si le nombre de quiz pour le cours est atteint
//       const course = await Course.findOne({ name: courseName });
//       if (!course) {
//           return res.status(404).json({ success: false, error: 'Course not found' });
//       }
//       // const quizzesCount = await Quiz.countDocuments({ course: course._id });
//       // if (quizzesCount >= course.nbrQuiz) {
//       //     return res.status(400).json({ success: false, error: 'Maximum number of quizzes for this course reached' });
//       // }

//       // // Créer un nouveau quiz avec le nom complet de l'étudiant
//       // const newQuiz = new Quiz({ studentName: `${firstName} ${lastName}`, courseName, questions });
//       await newQuiz.save();

//       res.status(201).json({ success: true, data: newQuiz });
//   } catch (error) {
//       console.error('Error creating quiz:', error);
//       res.status(500).json({ success: false, error: 'Error creating quiz' });
//   }
//   //   const quiz = await Quiz.create(req.body);
//   //   res.status(201).json({ success: true, data: quiz });
//   // } catch (error) {
//   //   res.status(400).json({ success: false, error: error.message });
  
// };


// // Récupérer tous les quizzes
// async function getAllQuizzes(req, res){
//   try {
//     const quizzes = await Quiz.find();
//     res.status(200).json({ success: true, data: quizzes });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Récupérer un quiz par ID
// async function getQuizById (req, res) {
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ success: false, error: 'Quiz not found' });
//     }
//     res.status(200).json({ success: true, data: quiz });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Mettre à jour un quiz
// async function updateQuiz (req, res) {

//   try {
//     const { id } = req.params;
//     const { questions } = req.body;

//     const quiz = await Quiz.findById(id);
//     if (!quiz) {
//         return res.status(404).json({ success: false, error: 'Quiz not found' });
//     }

//     // Mettre à jour les questions du quiz
//     quiz.questions = questions;
//     await quiz.save();

//     res.status(200).json({ success: true, data: quiz });
// } catch (error) {
//     console.error('Error updating quiz:', error);
//     res.status(500).json({ success: false, error: 'Error updating quiz' });
// }
//   // try {
//   //   const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
//   //     new: true,
//   //     runValidators: true
//   //   });
//   //   if (!quiz) {
//   //     return res.status(404).json({ success: false, error: 'Quiz not found' });
//   //   }
//   //   res.status(200).json({ success: true, data: quiz });
//   // } catch (error) {
//   //   res.status(400).json({ success: false, error: error.message });
//   // }
// };

// // Supprimer un quiz
// async function deleteQuiz (req, res) {
//   try {
//     const { id } = req.params;
//     const deletedQuiz = await Quiz.findByIdAndDelete(id);
//     if (!deletedQuiz) {
//         return res.status(404).json({ success: false, error: 'Quiz not found' });
//     }
//     res.status(200).json({ success: true, data: deletedQuiz });
// } catch (error) {
//     console.error('Error deleting quiz:', error);
//     res.status(500).json({ success: false, error: 'Error deleting quiz' });
// }
// };
