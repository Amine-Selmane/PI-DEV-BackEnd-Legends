
const asyncHandler = require('express-async-handler');
const Event = require('../model/event');
const firebaseConfig = require('../config/firebase.config'); // Adjust the path as needed



const eventController = {
    createEvent: asyncHandler(async (req, res) => {
        try {
          const event = new Event(req.body);
          await event.save();
          res.status(201).json(event);
        } catch (error) {
          console.error(error); // Log the error
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }),

  getAllEvents: asyncHandler(async (req, res) => {
    const events = await Event.find();
    res.json(events);
  }),

  getEventById: asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  }),

  updateEventById: asyncHandler(async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updatedEvent);
  }),

  deleteEventById: asyncHandler(async (req, res) => {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  }),


  

};

module.exports = eventController;




