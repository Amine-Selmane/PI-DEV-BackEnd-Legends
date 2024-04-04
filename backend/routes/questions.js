const express = require ("express")
const router = express.Router()
const questionController=require("../controller/questionController");

router.post('/createQuestion', questionController.createQuestion);
router.get('/getAllQuestions', questionController.getAllQuestions);

// Route pour récupérer un bulletin par son ID
router.get('/getQuestionById/:id', questionController.getQuestionById);

// Route pour mettre à jour un bulletin
router.put('/updateQuestion/:id', questionController.updateQuestion);
// Route pour supprimer un bulletin
router.delete('/deleteQuestion/:id',questionController.deleteQuestion);




module.exports = router