const express = require ("express")
const cors = require("cors");
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000 // 5000 is the default
const courses = require("./routes/coursesRoutes")

connectDB()

const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }))

app.use("/api/courses", courses);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
