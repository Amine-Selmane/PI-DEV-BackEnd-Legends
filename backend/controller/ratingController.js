const Rating = require('../model/rating');
const Book = require('../model/book'); // Import the Book model

// Controller function to add a rating to a book
const addRating = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Create a new rating document
    const newRating = new Rating({
      book: bookId,
      rating,
      comment
    });

    // Save the rating document to the database
    await newRating.save();

    res.status(201).json({ success: true, message: 'Rating added successfully' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ success: false, message: 'Failed to add rating' });
  }
};
const getAllRatingsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find all ratings for the specified book ID
    const ratings = await Rating.find({ book: bookId });

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Controller function to calculate average rating for a book
const getAverageRatingForBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find all ratings for the specified book ID
    const ratings = await Rating.find({ book: bookId });

    // Calculate average rating
    let totalRating = 0;
    ratings.forEach((rating) => {
      totalRating += rating.rating;
    });
    const averageRating = totalRating / ratings.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addRating, getAllRatingsForBook, getAverageRatingForBook };


