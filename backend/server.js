const express = require("express");
const colors = require('colors');
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const cors = require('cors');
const bookRouter = require("./routes/books");
const orderRouter = require("./routes/orders");
const ratingRouter = require("./routes/ratings");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS pour permettre l'accès depuis des origines différentes
app.use(cors());

// Routes pour les livres
app.use('/books', bookRouter);
app.use('/orders', orderRouter);
app.use('/ratings', ratingRouter);


// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
