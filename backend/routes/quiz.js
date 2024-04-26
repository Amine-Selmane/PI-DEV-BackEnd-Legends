const express = require ("express")
const router = express.Router()
const quizController=require("../controller/quizController");

router.post('/createQuiz', quizController.createQuiz);
router.get('/getAllQuizzes', quizController.getAllQuizzes);

// Route pour récupérer un bulletin par son ID
router.get('/getQuizById/:id', quizController.getQuizById);

// Route pour mettre à jour un bulletin
router.put('/updateQuiz/:id', quizController.updateQuiz);
// Route pour supprimer un bulletin
router.delete('/deleteQuiz/:id',quizController.deleteQuiz);
router.get('/getAllQuestions/all',quizController.getAllQuestions);
router.get('/questions/:courseId', quizController.getQuestionsByCourseId);
router.get('/getQuizByCode/:code', quizController.getQuizByCode);
router.get('/question/:id', quizController.getQuest);



router.get('/:code',quizController.getQuestionsByCode);
// Enregistrer les réponses du quiz
router.post('/submitQuiz', quizController.submitQuiz);

// Récupérer les réponses d'un quiz
router.get('/:id/answers', quizController.getQuizAnswers);

module.exports = router