const express = require('express');
const router = express.Router();
const { addRating } = require('../controller/ratingController');

// Route to add a rating to a book
router.post('/addRate', addRating);

module.exports = router;
