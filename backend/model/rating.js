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
  comment: {
    type: String,
    required: true
  },
  recordedAudio: {
    type: String // Store audio data as Buffer
  }// Field to store the audio recording as binary data
});


const Rating = mongoose.model('Rating', ratingSchema);


module.exports = Rating;