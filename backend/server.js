// Start the server

const express = require('express');
const app = express(); //
const connectDB = require('./config/db.js');
const colors = require('colors');
const reportRouter = require('./routes/reports');
const quizRouter = require('./routes/quiz');
const questionRouter = require('./routes/questions');
const User = require('./model/user');
const Course = require('./model/course');
const QuestionModel = require('./model/question');
const Quiz = require('./model/quiz.js');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const courses = require('./routes/coursesRoutes');
const schedule = require('./routes/scheduleRoutes');
const morgan = require('morgan');
const router = require('./routes/restRoutes.js');
const disponibiliteRoutes = require('./routes/disponibiliteRoutes.js');
const Payement = require('./routes/subscrition.js');

const EventRoutes = require('./routes/EventRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');

// Initialize OpenAI API client

// Chat endpoint

// Mount routers for books, orders, and ratings
const bookRouter = require('./routes/books');
const orderRouter = require('./routes/orders');
const ratingRouter = require('./routes/ratings');
const stripe = require('./routes/stripeBook');

// const Event = require('./model/event');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Route pour récupérer tous les enseignants
app.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Error fetching teachers' });
  }
});

// Route pour récupérer tous les étudiants
app.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});
// Route pour récupérer tous les grades des étudiants
app.get('/grades', async (req, res) => {
  try {
    // Utilisez la méthode distinct de MongoDB pour récupérer tous les grades uniques des étudiants
    const grades = await User.distinct('grade', { role: 'student' });
    res.json(grades); // Renvoyez la liste des grades des étudiants au client
  } catch (error) {
    console.error('Error fetching student grades:', error);
    res.status(500).json({ error: 'Error fetching student grades' });
  }
});

// Route pour récupérer tous les cours
app.get('/Courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

app.get('/questions', async (req, res) => {
  try {
    const questions = await QuestionModel.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});
// Enregistrez le modèle Question avec Mongoose
//const Question = mongoose.model('Question', QuestionSchema);

// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that
app.use('/courses', courses);
app.use('/scheduleSessions', schedule);
app.use('/reports', reportRouter);
app.use('/quiz', quizRouter);
app.use('/questions', questionRouter);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.use('/books', bookRouter);
app.use('/orders', orderRouter);
app.use('/ratings', ratingRouter);
app.use('/api/stripe', stripe);
// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

/** api routes for user */
app.use('/api', router);
app.use('/courses', courses);
app.use('/inscri',Payement);

/** disponibilite routes for disponibilite */
app.use('/disponibilte', disponibiliteRoutes);

app.use('/', EventRoutes);
app.use('/', ReservationRoutes);
app.use('/', stripe);

require('dotenv').config();

const { upload, uploadMultiple } = require('./middleware/multer');

const { getStorage, ref, uploadBytesResumable } = require('firebase/storage');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('./config/firebase.config');

app.post('/saveImageUrl', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Save imageUrl to the database
    const savedImageUrl = await ImageUrl.create({ imageUrl });

    // Log the saved document for verification (optional)
    console.log('Saved Image URL:', savedImageUrl);

    // Respond with a success status
    res.status(200).send('Image URL saved successfully');
  } catch (error) {
    console.error('Error saving image URL to database:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});