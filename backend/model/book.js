const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // Define a field to store the file reference
    file: {
        type: String, // Assuming you'll store the file path or URL
        required: true,
    }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;