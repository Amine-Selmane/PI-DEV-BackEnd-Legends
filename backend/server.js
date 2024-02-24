const express = require ("express")
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const port = process.env.PORT || 5000 // 5000 is the default

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/courses", require("./routes/coursesRoutes")) 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
