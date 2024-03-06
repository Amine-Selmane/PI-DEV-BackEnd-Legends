const express = require('express');
const router = express.Router();
const eventController = require('../controller/EventController');

router.post('/events/add', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/update/:id', eventController.updateEventById);
router.delete('/events/delete/:id', eventController.deleteEventById);





module.exports = router;
