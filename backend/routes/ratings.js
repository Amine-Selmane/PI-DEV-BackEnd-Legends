const express = require('express');
const router = express.Router();
const axios = require('axios');
const Sentiment = require('sentiment'); // Corrected import
const Rating = require('../model/rating');
const ratingController = require('../controller/ratingController');

router.post('/addRate', ratingController.addRating);
router.get('', ratingController.getAllRatings);
router.get('/getratingsforbook/:bookId', ratingController.getAllRatingsForBook);
router.get('/getAverageRatingForBook/:bookId', ratingController.getAverageRatingForBook);

router.get('/getuserreviewforbook/:bookId/:userId', async (req, res) => {
    try {
        const { bookId, userId } = req.params;
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

router.get('/api/reviews/:id/audio', async (req, res) => {
    const { id } = req.params;

    try {
        const rating = await Rating.findById(id);

        if (!rating || !rating.recordedAudio) {
            return res.status(404).send('Audio file not found');
        }

        res.set('Content-Type', 'audio/mpeg');
        res.send(rating.recordedAudio);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).send('Internal server error');
    }
});

// Perform sentiment analysis on book comments
router.post('/sentiment', async (req, res) => {
    try {
        const { comments } = req.body;
        const sentimentAnalysisResults = [];

        // Initialize the sentiment analyzer correctly
        const sentimentAnalyzer = new Sentiment();

        // Perform sentiment analysis on each comment
        comments.forEach(comment => {
            const result = sentimentAnalyzer.analyze(comment);
            sentimentAnalysisResults.push(result.score >= 0 ? 'Positive' : 'Negative');
        });

        res.json({ sentiment: sentimentAnalysisResults });
    } catch (error) {
        console.error('Error performing sentiment analysis:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

