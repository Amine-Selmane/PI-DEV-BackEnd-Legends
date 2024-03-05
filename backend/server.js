const express = require ("express")
const cors = require('cors');
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const port = process.env.PORT || 5000 // 5000 is the default
const reportRouter = require("./routes/reports");
const quizRouter = require("./routes/quiz");
const User=require("./model/user");
const Course=require("./model/course");

connectDB()

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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


// Route pour récupérer tous les cours
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that
app.use("/reports", reportRouter);
app.use("/quiz",quizRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
