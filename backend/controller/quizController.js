const Quiz = require('../model/quiz');
const Course = require('../model/course');
const User = require('../model/user');
const Question = require('../model/question');



async function getQuestionsByCode(req, res) {
  const quizCode = req.params.code;
  try {
    // Recherche du quiz par son code
    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ error: 'No quiz found with the provided code.' });
    }
    // Récupération des détails de chaque question à partir de leurs IDs
    const questions = await Question.find({ _id: { $in: quiz.questions } });
    const quizDetails = {
      _id: quiz._id,
      studentGrade: quiz.studentGrade,
      course: quiz.course,
      questions: questions,
      date: quiz.date,
      beginTime: quiz.beginTime,
      endTime: quiz.endTime,
      code: quiz.code,
    };
    res.json({ quiz: quizDetails });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'An error occurred while fetching the quiz.' });
  }
}

 async function getQuest (req, res) {
  const questionId = req.params.id;
  try {
    // Recherche de la question par son ID dans la base de données
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'No question found with the provided ID.' });
    }
    // Si la question est trouvée, la renvoyer en tant que réponse
    res.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'An error occurred while fetching the question.' });
  }
};
// POST - Créer un nouveau quiz
async function createQuiz(req, res) {
  try {
    const { studentGrade, courseId, date, beginTime, endTime, questionIds, code } = req.body;

    // Ajout de validation pour le code (4 chiffres)
    // if (!/^\d{4}$/.test(code)) {
    //   return res.status(400).json({ message: 'Code must be 4 digits' });
    // }

    const student = await User.findOne({ grade: studentGrade });
    const course = await Course.findById(courseId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (!student || !course || questions.length !== questionIds.length || questions.length < 5) {
      return res.status(400).json({ message: 'Student, course, or question(s) not found, or less than 5 questions provided' });
    }

    const quiz = new Quiz({
      studentGrade,
      course: course._id,
      questions: questions.map(question => question._id),
      date,
      beginTime,
      endTime,
      code // Ajout du champ code
    });
    
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: error.message });
  }
}

async function getQuizByCode(req, res) {
  const code = req.params.code;

  try {
    // Rechercher le quiz dans la base de données en utilisant le code fourni
    const quiz = await Quiz.findOne({ code });

    if (!quiz) {
      // Si aucun quiz n'est trouvé avec le code fourni, renvoyer une réponse indiquant qu'aucun quiz n'a été trouvé
      return res.status(404).json({ message: 'No quiz found with the provided code.' });
    }

    // Si un quiz est trouvé, renvoyer le quiz dans la réponse
    res.json({ quiz });
  } catch (error) {
    // En cas d'erreur lors de la recherche du quiz, renvoyer une réponse d'erreur
    console.error('Error fetching quiz by code:', error);
    res.status(500).json({ message: 'An error occurred while fetching the quiz.' });
  }
}

// GET - Récupérer tous les quiz
// GET - Récupérer tous les quiz
async function getAllQuizzes(req, res) {
  try {
    const quizzes = await Quiz.find()
      .populate({ path: 'course', select: 'name' })
      .populate({ path: 'questions', select: 'content' })
      .populate({ path: 'student', select: 'grade' }); // Populer le champ student

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// GET - Récupérer un quiz par son ID
async function getQuizById(req, res) {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('student', 'grade')
      .populate('course', 'name')
      .populate('questions', 'content');
    console.log('Quiz data:', quiz); 
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ quiz }); 
  } catch (error) {
    console.log('Error fetching quiz:', error); 
    res.status(500).json({ message: error.message });
  }
}

// PUT - Mettre à jour un quiz
// PUT - Mettre à jour un quiz
async function updateQuiz(req, res) {
  try {
    const quizId = req.params.id;
    const { date, beginTime, endTime, questionIds,code } = req.body;

    let quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    quiz.date = date;
    quiz.beginTime = beginTime;
    quiz.endTime = endTime;
    quiz.questions = questions;
    quiz.code = code;

    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ error: "Error updating quiz" });
  }
}

// DELETE - Supprimer un quiz
async function deleteQuiz(req, res) {
  try {
      const quizId = req.params.id;
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
      }
      await Quiz.findByIdAndDelete(quizId);
      res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: 'Error deleting quiz' });
  }
}

// GET - Récupérer toutes les questions
async function getAllQuestions(req, res) {
  try {
    const questions = await Question.find();
    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: "Error fetching questions" });
  }
}

async function getQuestionsByCourseId(req, res) {
  try {
    const courseId = req.params.courseId;

    // Rechercher les questions associées au cours spécifié
    const questions = await Question.find({ course: courseId });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions by course ID:', error);
    res.status(500).json({ error: 'Error fetching questions by course ID' });
  }
}

// POST - Enregistrer les réponses du quiz
async function submitQuiz(req, res) {
  try {
    const { quizId, userAnswers } = req.body;

    // Vérifier si le quiz existe
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Vérifier si le quiz est déjà terminé
    if (quiz.date > new Date()) {
      return res.status(400).json({ error: 'Quiz has not yet ended' });
    }

    // Vérifier si l'utilisateur a déjà soumis le quiz
    if (quiz.userAnswerIndex) {
      return res.status(400).json({ error: 'Quiz has already been submitted' });
    }

    // Mettre à jour les réponses de l'utilisateur dans le quiz
    quiz.userAnswerIndex = userAnswers;
    await quiz.save();

    res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Error submitting quiz' });
  }
}

// GET - Récupérer les réponses d'un quiz par son ID
async function getQuizAnswers(req, res) {
  try {
    const quizId = req.params.id;

    // Vérifier si le quiz existe
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Vérifier si le quiz est terminé
    if (quiz.date > new Date()) {
      return res.status(400).json({ error: 'Quiz has not yet ended' });
    }

    // Vérifier si l'utilisateur a soumis le quiz
    if (!quiz.userAnswerIndex) {
      return res.status(400).json({ error: 'User has not submitted the quiz yet' });
    }

    res.status(200).json({ studentAnswers: quiz.userAnswerIndex });
  } catch (error) {
    console.error('Error fetching quiz answers:', error);
    res.status(500).json({ error: 'Error fetching quiz answers' });
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
module.exports={createQuiz,getAllQuizzes,getQuizById,updateQuiz,deleteQuiz,getAllQuestions,getQuizAnswers,submitQuiz,getQuestionsByCourseId,getQuizByCode,getQuestionsByCode,getQuest};
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
