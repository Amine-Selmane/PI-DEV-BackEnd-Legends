const express = require ("express")
const cors = require('cors');
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const port = process.env.PORT || 5000 // 5000 is the default
const reportRouter = require("./routes/reports");
connectDB()

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that
app.use("/reports", reportRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
