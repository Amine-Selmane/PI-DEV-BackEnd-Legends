const express = require ("express")
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const port = process.env.PORT || 5000 // 5000 is the default
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes/restRoutes.js')
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(cors());

// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

/** api routes for user */
app.use('/api',router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
