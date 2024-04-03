const express = require('express');
const router = express.Router();
const { addRating,getAllRatingsForBook ,getAverageRatingForBook} = require('../controller/ratingController');
const Rating = require('../model/rating');


// Route to add a rating to a book
router.post('/addRate', addRating);
router.get('/getratingsforbook/:bookId',getAllRatingsForBook);
router.get('/getAverageRatingForBook/:bookId',getAverageRatingForBook);
router.get('/getuserreviewforbook/:bookId/:userId', async (req, res) => {
    try {
      const { bookId, userId } = req.params;
  
      // Find the review for the specified book and user
      const userReview = await Rating.findOne({ bookId, userId });
  
      if (!userReview) {
        return res.status(404).json({ message: 'Rating not found' });
      }
  
      res.json(userReview);
    } catch (error) {
      console.error('Error fetching user Rating:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  
module.exports = router;
