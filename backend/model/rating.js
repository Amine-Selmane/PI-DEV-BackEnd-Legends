const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;