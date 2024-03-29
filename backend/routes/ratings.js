const express = require('express');
const router = express.Router();
const { addRating,getAllRatingsForBook ,getAverageRatingForBook} = require('../controller/ratingController');

// Route to add a rating to a book
router.post('/addRate', addRating);
router.get('/getratingsforbook/:bookId',getAllRatingsForBook);
router.get('/getAverageRatingForBook/:bookId',getAverageRatingForBook);


module.exports = router;
