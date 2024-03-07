const Book = require('../model/book');
const multer = require('multer');

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
    
        const book = await Book.findById(id);
    
        return res.status(200).json(book);
      } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
      }
};




// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});

const upload = multer({ storage: storage });

// Route for adding a book
const create = async (req, res) => {
    try {
      // Extract book data from request body
      const { title, description, price } = req.body;
  
      // Check if a file was uploaded
      if (!req.file) {
        throw new Error('No file uploaded');
      }
  
      // Get the file path from the uploaded file
      const file = req.file.path;
  
      // Create a new book object
      const newBook = new Book({
        title,
        description,
        price,
        file // Save the file path in the book object
      });
  
      // Save the book to the database
      await newBook.save();
  
      res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
      console.error('Error adding book:', error);
      res.status(500).json({ error: 'Failed to add book' });
    }
  };
  
async function getall(req, res) {
  try {
    const { sortOrder } = req.query;
        let sortQuery = {};
        if (sortOrder === 'asc') {
            sortQuery = { 'price': 1 };
        } else if (sortOrder === 'desc') {
            sortQuery = { 'price': -1 };
        }
    const books = await Book.find().sort(sortQuery);

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

async function update(req, res) {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("updated");
  } catch (err) {
    res.status(400).send(err);
  }
}

async function deletebook (req, res) {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        await Book.findByIdAndDelete(bookId);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Error deleting report' });
    }
}
async function getByTitle(req, res) {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Title parameter is required for searching" });
    }

    const books = await Book.find({ title: { $regex: title, $options: 'i' } });

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { create, getall, update, deletebook, getByTitle, getBookById };
