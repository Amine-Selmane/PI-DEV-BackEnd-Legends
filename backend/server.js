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
connectDB()

const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }))
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(cors());

// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

/** api routes for user */
app.use('/api',router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
