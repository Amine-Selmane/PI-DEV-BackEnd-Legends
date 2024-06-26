const Book = require('../model/book');
const Rating = require('../model/rating'); // Import the Rating model if it's a separate model

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

async function deletebook(req, res) {
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

// Function to submit rating and comment
const submitRating = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Create a new rating document
    const newRating = new Rating({
      bookId,
      rating,
      comment
    });

    // Save the rating to the database
    await newRating.save();

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'An error occurred while submitting the rating' });
  }
};

module.exports = { getall, update, deletebook, getByTitle, getBookById, submitRating };