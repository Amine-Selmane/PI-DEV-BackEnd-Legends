const express = require("express");
const colors = require('colors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const { Configuration, OpenAI } = require("openai");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Initialize OpenAI API client
const openai = new OpenAI({ apiKey:"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"});

// Chat endpoint
app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        // Call OpenAI API to generate a completion based on the prompt
        const response = await openai.complete({
            engine: "davinci",
            prompt: prompt,
            maxTokens: 512,
            temperature: 0
        });

        // Send the generated completion back as the response
        res.json({ completion: response.data.choices[0].text });
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Mount routers for books, orders, and ratings
const bookRouter = require("./routes/books");
const orderRouter = require("./routes/orders");
const ratingRouter = require("./routes/ratings");
const stripe = require("./routes/stripe");


app.use('/books', bookRouter);
app.use('/orders', orderRouter);
app.use('/ratings', ratingRouter);
app.use('/api/stripe', stripe);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
