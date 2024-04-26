const Question = require('../model/question');

async function createQuestion(req, res) {
    try {
        const { content, options, correctOptionIndex } = req.body;
        const question = new Question({ content, options, correctOptionIndex });
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Error creating question' });
    }
}

async function getAllQuestions(req, res) {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
}

async function getQuestionById(req, res) {
    const questionId = req.params.id;
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.status(200).json({ question: question });
    } catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(500).json({ error: 'Error fetching question' });
    }
}

async function updateQuestion(req, res) {
    const questionId = req.params.id;
    const updateData = req.body;
    console.log('Received update data:', updateData); // Vérifiez les données reçues du front-end
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateData, { new: true });
      console.log('Updated question:', updatedQuestion); // Vérifiez la question mise à jour
      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.status(200).json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Error updating question' });
    }
  }

async function deleteQuestion(req, res) {
    const questionId = req.params.id;
    try {
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.status(200).json(deletedQuestion);
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Error deleting question' });
    }
}

module.exports = {createQuestion,getAllQuestions, getQuestionById,updateQuestion,deleteQuestion};
