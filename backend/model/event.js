
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  location: String,
  description: String,
  price: Number,
  nbrPlaces: Number,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
