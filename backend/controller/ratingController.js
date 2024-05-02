
const Rating = require('../model/rating');
const Book = require('../model/book');


const addRating = async (req, res) => {
  try {
    const { bookId, rating, comment, recordedAudio } = req.body;


    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }


    const newRating = new Rating({
      book: bookId,
      rating,
      comment,
      recordedAudio: recordedAudio // Store recorded audio URL
    });


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


    const ratings = await Rating.find({ book: bookId });


    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAverageRatingForBook = async (req, res) => {
  try {
    const { bookId } = req.params;


    const ratings = await Rating.find({ book: bookId });


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


const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate('book');
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = { addRating, getAllRatingsForBook, getAverageRatingForBook, getAllRatings };