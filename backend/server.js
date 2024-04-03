const express = require ("express")
const cors = require("cors");
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000 
const courses = require("./routes/coursesRoutes")
const morgan = require('morgan');
const router = require('./routes/restRoutes.js')
const EventRoutes = require('./routes/EventRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');
const stripe = require("./routes/Stripe");

// const Event = require('./model/event');


connectDB()
const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');



// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

/** api routes for user */
app.use('/api',router)

app.use('/', EventRoutes); 
app.use('/', ReservationRoutes); 
app.use("/", stripe);

require('dotenv').config()

const { upload, uploadMultiple } = require('./middleware/multer')

const { getStorage, ref ,uploadBytesResumable } = require('firebase/storage')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require('./config/firebase.config')



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
    console.log(`Server is running on port ${port}`)
})
