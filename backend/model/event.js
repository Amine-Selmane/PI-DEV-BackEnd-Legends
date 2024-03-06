const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  beginTime: String,
  endTime: String,
  location: String,
  description: String,
  price: Number,
  nbrPlaces: Number,
  imageUrl: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
